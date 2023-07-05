import * as fs from "fs";
import { join as joinPath } from "path";
import { homedir } from "os";
import { Entry } from "./prompt";

export const PROJECT_DIR = joinPath(homedir(), "/projects/");
export const TEMPLATES_DIR = joinPath(homedir(), "/.zsh/templates/")
export const TEMPLATES_PATH = joinPath(TEMPLATES_DIR, "templates.json");

export function getProjects(): Entry[] {
    return fs.readdirSync(PROJECT_DIR).map(dirname => {
        const projectPath = joinPath(PROJECT_DIR, dirname);
        if(!fs.statSync(projectPath).isDirectory()) return null;
        const projectData: ProjectData = parseProjectData(projectPath);

        let openWith = projectData.editor ?? "terminal";
        const projectName = projectData.name ?? dirname;

        if(shouldBeCode(projectPath)) openWith = "code";
        if(shouldBeIdea(projectPath)) openWith = "idea";

        const u: Entry = {
            text: projectName,
            info: {
                step: "open",
                extra: {
                    openWith: openWith,
                    path: projectPath
                }
            },
            nonselectable: isEmpty(projectPath),
            meta: [
                openWith,
                projectData.template ?? ""
            ]
        };

        return u;
    });
}

export function getTemplates(projectName: string): Entry[] {
    const empty: Entry = {
        text: "Empty",
        info: {
            step: "create",
            extra: {
                projectName: projectName,
                template: {
                    name: "Empty"
                }
            }
        },
        meta: ["nothing"]
    };

    if(!fs.existsSync(TEMPLATES_PATH)) {
        return [empty];
    }

    const templates: Template[] = JSON.parse(fs.readFileSync(TEMPLATES_PATH, {encoding: "utf-8"}));
    const u: Entry[] = templates.map(template => {
        return {
            text: template.name,
            info: {
                step: "create",
                extra: {
                    projectName: projectName,
                    template: template
                }
            },
            meta: template.meta
        }
    });

    u.push(empty);
    return u;
}

export function createProjectDir(projectName: string, template: Template) {
    fs.mkdirSync(joinPath(PROJECT_DIR, projectName));
    if(template.name == "Empty") {
        process.exit(0);
    }
}

export function getScriptPath(template: Template) {
    return joinPath(TEMPLATES_DIR, template.scriptPath);
}

export function getProjectPath(projectName: string) {
    return joinPath(PROJECT_DIR, projectName);
}

export type Template = {
    name: string;
    scriptPath: string;
    meta?: string[];
}

type ProjectData = {
    name?: string;
    editor?: "terminal" | "idea" | "code" | string;
    template?: string;
}

function parseProjectData(projectPath: string): ProjectData {
    const filePath = joinPath(projectPath, ".pm_data.json");
    if(!fs.existsSync(filePath)) return {};

    const parsed = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));

    return parsed;
}

function isEmpty(projectPath: string): boolean {
    return fs.readdirSync(projectPath).length < 1;
}

function shouldBeCode(projectPath: string): boolean {
    return fs.existsSync(joinPath(projectPath, "package.json")) || fs.existsSync(joinPath(projectPath, "tsconfig.json")) || fs.existsSync(joinPath(projectPath, "index.js")) || fs.existsSync(joinPath(projectPath, "index.ts")) || fs.existsSync(joinPath(projectPath, "main.py")) || fs.existsSync(joinPath(projectPath, ".vscode"));
}

function shouldBeIdea(projectPath: string): boolean {
    return fs.existsSync(joinPath(projectPath, "pom.xml")) || fs.existsSync(joinPath(projectPath, "build.gradle")) || fs.existsSync(joinPath(projectPath, ".idea"));
}