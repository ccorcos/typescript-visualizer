/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import React from "react"
import ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { css } from "glamor"

css.global("body", {
	margin: 0,
	padding: 0,
	overflow: "hidden",
})

class Editor extends Component<{}> {
	node: HTMLDivElement
	handleRef = node => {
		this.node = node
	}

	didMount() {
		const editor = monaco.editor.create(this.node, {
			value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
				"\n"
			),
			language: "javascript",
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
