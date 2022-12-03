# Rofi Project Browser

Simple little project browser for Rofi I made with Node & TypeScript.
Default project path is `~/projects`, and the default template path is `~/.zsh/templates`. Both can be changed in `src/projects.ts`.

Templates should be placed in the `{TEMPLATES_DIR}/templates.json` file, with a format of
```
[
    {
        "name": "Template Name",
        "scriptPath": "path to template script",
        "meta": [
            "extra",
            "rofi",
            "meta tags"
        ]
    }
]
```
Templates work fairly simply: when you create a new project by specifying a non-existent project, you can select one from the list of templates, which will then execute the script with the path to the new directory as the first parameter. The directory is automatically created so your script doesn't need to.