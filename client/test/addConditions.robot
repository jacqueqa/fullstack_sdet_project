*** Settings *** 
Documentation       The user can add a condition to a case
Library             Browser
Library            Collections

Test Setup           Open test browser
Test Teardown        Close all test browsers


*** Variables ***
${HEADLESS}         true
${LOGINCRED}        drajackie@superdoctor.com 
${PASSWORD}         Lalala#123

*** Test Cases ***
User can add a condition to the first unreviewed case
    [Documentation]      Add first condition
    Input Username       ${LOGINCRED}
    Input Password       ${PASSWORD}  
    Submit Credentials
    Check Logged User
    Check if the case is on the page
    Check the content of the case
    Disable Next Case
    Select the condition
    Go to the Next Case
    
User can add a condition to the second unreviewed case
    [Documentation]      Add second condition
    Input Username       ${LOGINCRED}
    Input Password       ${PASSWORD}  
    Submit Credentials
    Check Logged User
    Check if the case is on the page
    Check the content of the case
    Disable Next Case
    Select the condition
    Go to the Next Case

User can add a condition to the third unreviewed case
    [Documentation]      Add second condition
    Input Username       ${LOGINCRED}
    Input Password       ${PASSWORD}  
    Submit Credentials
    Check Logged User
    Check if the case is on the page
    Check the content of the case
    Disable Next Case
    Select the condition
    Go to the Next Case

    
User doesnt have unreviewed cases
    [Documentation]      You are done case
    Input Username       ${LOGINCRED}
    Input Password       ${PASSWORD}  
    Submit Credentials
    Check Logged User
    Check if the case is not on the page
    Check if the condition is not on the page
    Check you are done



*** Keywords ***
Open test browser
   New Page       http://localhost:3000

Input Username
   [Arguments]  ${USERNAME}
   Type Text    id=username    ${USERNAME}

Input Password
   [Arguments]  ${PASSWORD}
   Type Text   id=password    ${PASSWORD}

Submit Credentials
    Get Element States    id=submit    contains    enabled
   Click  id=submit
   
Check Logged User
   Get Text  id=loginInfo  ==  Logged in as: Dra Jacqueline

Check if the case is on the page
   Get Element States    id=case    contains    visible

Check if the case is not on the page
   Get Element States    id=case    contains    hidden

Check if the condition is not on the page
   Get Element States   id=conditions       contains    hidden

Check the content of the case
    ${CaseDescription}    Get Text    id=case
    Should Contain    ${CaseDescription}    Patient

Select the Condition
    ${NUMBER}    Evaluate    random.sample(range(1, 122),1)    random
    Select Options By    select[id=conditions]    index    ${NUMBER}[0]    

Go to the Next Case
    Get Element States    id=nextCase    contains    enabled
    Click    id=nextCase

Disable Next Case
    Get Element States    id=nextCase    contains    disabled

Check you are done
    Get Text    id=contentInfo    ==    You are done.

Close all test browsers
   Close Browser








    









