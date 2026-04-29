@echo off
chcp 65001 >nul
REM =========================================================
REM  내일플러스 GitHub 1회 셋업 스크립트 (v2 — 더 안전한 버전)
REM
REM  Why this exists:
REM   - gh auth login은 대화형이라 Claude의 비대화식 PowerShell
REM     세션에서 직접 호출이 불가. 사용자가 cmd 창 하나만 띄우면
REM     인증→저장소 생성→푸시까지 한 번에 끝나도록 묶음.
REM
REM  Why v2:
REM   - v1에서 사용자가 인증 도중 창을 닫는 사고가 있었음.
REM     v2는 (a) 시작 시 pause 제거(즉시 진행) (b) 매 단계 종료 후
REM     명시적 pause로 절대 자동 종료되지 않도록 변경.
REM   - 이미 인증/커밋/리모트가 있으면 스킵해 멱등성 확보 → 재실행 안전.
REM =========================================================

setlocal
cd /d "%~dp0"

echo.
echo ===============================================================
echo                내일플러스 GitHub 셋업 (v2)
echo ===============================================================
echo.
echo *** 이 창을 닫지 마세요. 끝까지 자동 진행됩니다. ***
echo.

REM Why: 이미 auth된 상태에서 재실행해도 device code 표시되며 사용자
REM      혼란을 유발하므로 사전 체크로 분기.
echo [STEP 1/4] GitHub 인증 상태 확인
gh auth status >nul 2>&1
if %errorlevel%==0 (
    echo  - 이미 인증돼 있습니다. 인증 단계 건너뜁니다.
    goto AFTER_AUTH
)

echo  - 인증이 필요합니다. 잠시 후 8자리 코드(예: ABCD-1234)가 표시됩니다.
echo  - 자동으로 브라우저가 열립니다.
echo  - 브라우저에 코드 붙여넣고 [Authorize] 클릭만 하면 끝.
echo.

REM Why: --hostname / --git-protocol / --web 플래그로 대화형 질문 3개를
REM      미리 답변해 사용자가 답해야 할 단계를 device code 입력 1회로 축소.
gh auth login --hostname github.com --git-protocol https --web
if errorlevel 1 (
    echo.
    echo [에러] GitHub 인증 실패. 본 파일을 다시 더블클릭해 재시도하세요.
    echo.
    pause
    exit /b 1
)

:AFTER_AUTH
echo.
echo [STEP 2/4] git 자격증명 헬퍼 등록
REM Why: gh가 git push 시 자동으로 자격증명을 넘겨주도록 연결.
REM      이게 있어야 다음번 "깃허브 올려줘" 명령이 무인증으로 동작.
gh auth setup-git
if errorlevel 1 (
    echo  - [경고] 헬퍼 등록 실패했지만 진행 계속.
)

echo.
echo [STEP 3/4] 로컬 git 저장소 점검
REM Why: 이전 실행에서 git init/commit이 이미 끝났을 수 있음.
REM      git init은 기존 .git이 있어도 안전(reinit 메시지만 출력).
git init >nul 2>&1
git add -A >nul 2>&1
REM Why: commit할 변경이 없을 때 errorlevel=1을 반환하지만 정상 케이스
REM      이므로 무시. 출력만 표시하고 다음 단계로 진행.
git commit -m "Update: 내일플러스 랜딩페이지" >nul 2>&1
if errorlevel 1 (
    echo  - 신규 변경 없음 - 기존 커밋으로 진행.
) else (
    echo  - 변경사항 커밋 완료.
)

echo.
echo [STEP 4/4] GitHub 원격 저장소 생성 및 푸시
REM Why: 이미 origin remote가 등록돼 있으면 repo create는 실패함.
REM      이 경우 단순 push로 폴백.
git remote get-url origin >nul 2>&1
if %errorlevel%==0 (
    echo  - 이미 origin remote 존재. push만 수행.
    git push -u origin main
    if errorlevel 1 (
        echo  - [에러] push 실패.
        pause
        exit /b 1
    )
) else (
    echo  - 신규 저장소 생성 + 첫 푸시.
    REM Why: --public(공개) / --source=. / --push로 한 번에 종료.
    gh repo create naeilplus-landing --public --source=. --push --remote=origin --description "내일플러스 컨설팅 랜딩페이지"
    if errorlevel 1 (
        echo.
        echo [에러] 저장소 생성/푸시 실패.
        echo  - 같은 이름의 저장소가 이미 GitHub에 있는지 확인하세요.
        echo  - https://github.com/[유저명]?tab=repositories
        pause
        exit /b 1
    )
)

echo.
echo ===============================================================
echo                          완료!
echo ===============================================================
echo.
echo GitHub 저장소가 생성되고 코드가 업로드되었습니다.
echo 잠시 후 브라우저에서 저장소를 열어드립니다.
echo.

REM Why: 사용자가 결과를 즉시 확인할 수 있도록 저장소 페이지 자동 오픈.
gh repo view --web

echo.
echo === 다음 단계 (선택사항) ===
echo  무료 호스팅(GitHub Pages)을 켜시려면:
echo   1. 저장소 페이지에서 [Settings] 탭
echo   2. 좌측 메뉴 [Pages]
echo   3. Source: Deploy from a branch / Branch: main / Folder: / (root)
echo   4. [Save] 클릭
echo   5. 1-2분 후 https://[유저명].github.io/naeilplus-landing/ 접속 가능
echo.
echo 이 창은 [아무 키]를 누르면 닫힙니다.
pause
endlocal
