import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from 'react';
// Basic CodeMirror setup
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightSpecialChars, drawSelection, highlightActiveLine, lineNumbers } from '@codemirror/view';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';

// The "legacy" NGINX mode from CodeMirror 5:
import { StreamLanguage } from '@codemirror/language';
import { nginx as nginxMode } from '@codemirror/legacy-modes/mode/nginx';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getNginxConfigData, restartNginx, saveNginxConfigFile } from "@/services/nginxconfig.service";
import { IconCode, IconReload, IconUvIndex } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/hooks/use-toast";


const NginxFile = () => {
    const { toast } = useToast();
    const [open, setOpen] = useState("");
    const [errorData, setErrorData] = useState<string | undefined>(undefined);
    const [successData, setSuccessData] = useState<string | undefined>(undefined);
    const [onRestart, setOnRestart] = useState(false);
    const [onSubmiting, setOnSubmiting] = useState(false);
    const [editorType, setEditorType] = useState(window.localStorage.getItem('editorType') || 'code');
    const { isLoading, error, data } = useQuery({
        queryKey: ["nginxfile", editorType],
        queryFn: () => getNginxConfigData(editorType).then((res) => res.data),
        placeholderData: keepPreviousData,
    });
    const [file, setFile] = useState('');


    const editorRef = useRef(null);

    useEffect(() => {
        // Create initial editor state
        const startState = EditorState.create({
            doc: data?.data?.file ?? '',
            extensions: [
                highlightSpecialChars(),
                drawSelection(),
                highlightActiveLine(),
                history(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                syntaxHighlighting(defaultHighlightStyle),
                // Add the legacy NGINX syntax highlighting
                StreamLanguage.define(nginxMode),
                lineNumbers(), // Add line numbers
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        setFile(v.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    "&": { minHeight: "500px" }
                })
            ],
        });

        // Create the EditorView and attach it to our ref
        const view = new EditorView({
            state: startState,
            parent: editorRef.current || undefined,
        });

        setFile(data?.data?.file ?? "");
        // Cleanup when component unmounts
        return () => {
            view.destroy();
        };
    }, [data?.data?.file, editorType]);


    const onRestartNginx = () => {
        setOnRestart(true);
        restartNginx().then(res => res.data).then(({ error }) => {
            if (error) {
                toast({
                    variant: 'destructive',
                    title: `${error?.message}`,
                })
                setOnRestart(false);
            } else {
                toast({
                    variant: 'default',
                    title: `Server restarted successfully`,
                })
                setOnRestart(false);
                setSuccessData(undefined)
                setErrorData(undefined)
                setOpen('')
            }
        }).catch((error) => {
            toast({
                variant: 'destructive',
                title: `${error?.message}`,
            })
            setOnRestart(false);
        })
    }


    return (
        <Main
            loading={isLoading}
            error={error?.message ?? data?.error?.message}
            title="Nginx File Settings"
            bareadcrumb={[{
                name: 'Homes',
                href: '/'
            }, { name: 'Nginx File Settings' }]}
            rightComponent={<div className="flex items-right gap-1">
                <Button disabled={onRestart} onClick={() => onRestartNginx()}> {onRestart ? <Loader2 className="animate-spin" /> : <IconReload />}</Button>
                {editorType === 'visual' ? (
                    <Button variant="outline" onClick={() => setEditorType('code')}><IconCode /></Button>
                ) : (
                    <>
                        <Button onClick={() => setEditorType('visual')}><IconUvIndex /></Button>
                        <Button onClick={() => setOpen("save")}>Save</Button>
                    </>
                )}
            </div>}
        >
            {editorType === 'code' ? (
                <div>
                    <div ref={editorRef} style={{ border: '1px solid #ccc', borderRadius: 4 }} />
                    <ConfirmDialog
                        key='dfvrrdfbfv-delete'
                        open={open === 'save'}
                        onOpenChange={() => {
                            setOpen('')
                            setErrorData(undefined)
                            setSuccessData(undefined)
                        }}
                        isLoading={onSubmiting}
                        handleConfirm={() => {
                            setOnSubmiting(true);
                            saveNginxConfigFile({ file }).then(res => res.data).then(({ error }) => {
                                if (error) {
                                    setErrorData(error?.message);
                                    setSuccessData(undefined)
                                    setOnSubmiting(false);
                                } else {
                                    toast({
                                        variant: 'default',
                                        title: `Changes saved successfully`,
                                    })
                                    setErrorData(undefined);
                                    setSuccessData('Changes saved successfully, You can now restart the server to apply the changes');
                                    setOnSubmiting(false);
                                }
                            }).catch((error) => {
                                toast({
                                    variant: 'destructive',
                                    title: `${error?.message}`,
                                })
                                setSuccessData(undefined)
                                setOnSubmiting(false);
                            })
                        }}
                        className='max-w-md'
                        title={`Do you want to save the changes?`}
                        desc={
                            <>
                                {errorData && (
                                    <div className="text-red-500">{errorData}</div>
                                )}
                                {successData && (
                                    <div className="mt-2 text-center gap-2">
                                        <Button disabled={onRestart} onClick={() => onRestartNginx()}>{onRestart && <Loader2 className="animate-spin" />}Restart Now</Button>
                                        <div className="text-green-500 pt-4">{successData}</div>
                                    </div>
                                )}
                                {(!errorData && !successData) && (
                                    <div>Are you sure you want to save the changes?</div>
                                )}
                            </>
                        }
                        confirmText='Save Now'
                    />
                </div>
            ) : (
                <div>
                    <h1>Visual Editor</h1>
                </div>
            )}
        </Main>
    )
}

export default NginxFile;