```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Response "note created"
    deactivate server
    Note right of browser: The browser does not receive a redirect response 

    

    Note right of browser: The browser executes the callback function that renders the notes
```