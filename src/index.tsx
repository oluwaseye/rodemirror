import { forwardRef, useRef, useEffect } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useMergeRefs } from './merge-refs'
import type { ComponentProps } from 'react'
import type { Extension } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'

export type CodeMirrorProps = {
  value?: string
  onUpdate?: (update: ViewUpdate) => void
  extensions: Extension[]
} & ComponentProps<'div'>

const CodeMirror = forwardRef<HTMLDivElement, CodeMirrorProps>(
  ({ value, onUpdate, extensions: passedExtensions, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null)
    const mergedRef = useMergeRefs(ref, innerRef)

    useEffect(() => {
      const currentEditor = innerRef.current
      if (!currentEditor) return

      let view: EditorView
      ;(async () => {
        const extensions: Extension[] = []

        if (onUpdate) extensions.push(EditorView.updateListener.of(onUpdate))

        const state = EditorState.create({
          doc: value,
          extensions: [...extensions, ...passedExtensions],
        })

        view = new EditorView({ state, parent: currentEditor })
      })()

      return () => view.destroy()
    }, [innerRef])

    return <div ref={mergedRef} {...props} />
  }
)

CodeMirror.displayName = 'CodeMirror'

export default CodeMirror
