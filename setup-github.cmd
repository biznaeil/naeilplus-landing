@echo off
chcp 65001 >nul
REM =========================================================
REM  내일플러스 GitHub 1회 셋업 스크립트
REM  Why: gh auth login은 대화형이라 Claude의 비대화식 PowerShell
REM       세션에서 직접 호출이 불가. 사용자가 더블클릭만 하면
REM       인증 → 저장소 생성 → 푸시까지 한 번에 끝나도록 묶음.
REM  사용법: 본 파일을 더블클릭한 뒤 안내에 따라 브라우저에서
REM         코드 입력 + Authorize 클릭만 해주세요. 끝나면 자동 종료.
REM =========================================================

setlocal
cd /d "%~dp0"

echo.
echo ===============================================================
echo                  내일플러스 GitHub 셋업 시작
echo ===============================================================
echo.
echo [STEP 1] GitHub 인증 시작
echo  - 잠시 후 콘솔에 8자리 코드(예: ABCD-1234)가 표시됩니다
echo  - 자동으로 브라우저가 열립니다
echo  - 브라우저에 코드 붙여넣고 [Authorize] 클릭만 하면 끝
echo.
pause

REM Why: --hostname / --git-protocol / --web 플래그로 대화형 질문을
REM      미리 답변해 사용자가 답해야 할 단계를 최소화.
gh auth login --hostname github.com --git-protocol https --web
if errorlevel 1 (
    echo.
    echo [에러] GitHub 인증에 실패했습니다.
    echo 다시 시도하시려면 본 파일을 다시 더블클릭해주세요.
    pause
    exit /b 1
)

echo.
echo [STEP 2] git 자격증명 헬퍼 등록
REM Why: gh가 git push 시 자동으로 자격증명을 넘겨주도록 연결.
REM      이게 있어야 다음번 "깃허브 올려줘" 명령이 무인증으로 동작.
gh auth setup-git
if errorlevel 1 (
    echo [경고] 자격증명 헬퍼 등록에 실패했지만 진행은 계속합니다.
)

echo.
echo [STEP 3] 로컬 git 저장소 초기화 및 첫 커밋
REM Why: 신규 폴더를 GitHub에 올리려면 로컬에 git 히스토리가 있어야 함.
REM      이미 .git이 있으면 init은 무해(no-op)하게 끝남.
git init
git add -A
git commit -m "Initial commit: 내일플러스 랜딩페이지 v1 (홈 + 광고용 상세페이지 + 약관)"

echo.
echo [STEP 4] GitHub 저장소 생성 + push
REM Why: --public(공개) / --source=. (현재 폴더) / --push (업로드까지 한 번에)
REM      저장소 이름은 폴더명과 동일한 naeilplus-landing 사용.
gh repo create naeilplus-landing --public --source=. --push --remote=origin --description "내일플러스 컨설팅 랜딩페이지"
if errorlevel 1 (
    echo.
    echo [에러] 저장소 생성 또는 push에 실패했습니다.
    echo 같은 이름의 저장소가 이미 있는지 GitHub에서 확인해주세요.
    pause
    exit /b 1
)

echo.
echo ===============================================================
echo                          완료!
echo ===============================================================
echo.
echo GitHub 저장소가 생성되고 코드가 업로드되었습니다.
echo.
gh repo view --web
echo.
echo 무료 호스팅(GitHub Pages)을 켜시려면:
echo   저장소 ^> Settings ^> Pages ^> Branch: main ^> Save
echo   (몇 분 후 https://[유저명].github.io/naeilplus-landing/ 에서 접속)
echo.
pause
endlocal
