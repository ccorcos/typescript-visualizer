/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import React from "react"
import ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { css } from "glamor"
import * as ts from "typescript"

window["ts"] = ts

css.global("body", {
	margin: 0,
	padding: 0,
	overflow: "hidden",
})

const sourceCode = new Value(
	["function add(x: number, y: number) {", "\treturn x + y", "}"].join("\n")
)

class Editor extends Component<{}> {
	node: HTMLDivElement
	handleRef = node => {
		this.node = node
	}

	didMount() {
		const editor = monaco.editor.create(this.node, {
			value: sourceCode.get(),
			language: "typescript",
		})
		window["editor"] = editor
		editor.onDidChangeModelContent(e => {
			sourceCode.set(editor.getValue())
		})
	}

	view() {
		return (
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					display: "flex",
					height: "100vh",
					width: "100vw",
				}}
			>
				<div style={{ flex: 1 }} ref={this.handleRef} />
				<Visualize />
			</div>
		)
	}
}

// https://github.com/fkling/astexplorer/blob/master/website/src/parsers/js/typescript.js
function parse(code) {
	const filename = "main.tsx"

	const options = {
		experimentalDecorators: true,
		experimentalAsyncFunctions: true,
		jsx: true,
	}

	const compilerHost: ts.CompilerHost = {
		fileExists: () => true,
		getDirectories: () => [],
		getCanonicalFileName: filename => filename,
		getCurrentDirectory: () => "",
		getDefaultLibFileName: () => "lib.d.ts",
		getNewLine: () => "\n",
		getSourceFile: filename => {
			return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true)
		},
		readFile: () => null,
		useCaseSensitiveFileNames: () => true,
		writeFile: () => null,
	}

	const program = ts.createProgram(
		[filename],
		{
			noResolve: true,
			target: ts.ScriptTarget.Latest,
			experimentalDecorators: options.experimentalDecorators,
			experimentalAsyncFunctions: options.experimentalAsyncFunctions,
			jsx: ts.JsxEmit.Preserve,
		},
		compilerHost
	)

	const sourceFile = program.getSourceFile(filename)

	return sourceFile
}

class Visualize extends Component<{}> {
	view() {
		window["sourceFile"] = parse(sourceCode.get())
		// TODO: convert statements into a tree that we can use
		return (
			<div style={{ flex: 1 }}>
				{sourceCode.get()}
			</div>
		)
	}
}

declare const monacoReady: Promise<any>

async function main() {
	await monacoReady
	const root = document.createElement("div")
	document.body.appendChild(root)
	ReactDOM.render(<Editor />, root)
}

main().catch(console.error)
