*** Settings *** 
Documentation       The user can log in
Library             Browser

Test Setup           Open test browser
Test Teardown        Close all test browsers

*** Test Cases ***                       
Valid Login      
   [Documentation]      Test valid login
   Input Username       drajackie@superdoctor.com 
   Input Password       Lalala#123
   Submit Credentials   
   Check Logged User

Invalid Login      
   [Documentation]       Test invalid login
   Input Username        jackiedoctor@doctor.com 
   Input Password        wrong password
   Submit Credentials   
   Check Error Login
   


*** Keywords ***
Open test browser
   New Page       http://localhost:3000
   Login Page Should Be Open

Login Page Should Be Open
    Get Title    ==    Document

Input Username
   [Arguments]  ${USERNAME}
   Type Text    id=username    ${USERNAME}

Input Password
   [Arguments]  ${PASSWORD}
   Type Text   id=password    ${PASSWORD}

Submit Credentials
   Click  id=submit

Check Logged User
   Get Text  id=loginInfo  ==  Logged in as: Dra Jacqueline

Check Error Login
   Get Text  id=swal2-title  ==  Invalid Login

Close all test browsers
   Close Browser