import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";


interface ApplyStepProps {
    ips?: string[],
    defaultPort?: number
    defaultAddress?: string
}
export const ApplyStep: FC<ApplyStepProps> = ({ ips, defaultPort, defaultAddress }) => {
    ips = [...(window.location.hostname ? [window.location.hostname] : []), ...(ips ? ips?.filter(ip => ip != "0.0.0.0").filter(ip => ip != "127.0.0.1") : [])]
    const [showAll, setShowAll] = useState(false);
    const form = useFormContext();
    const singleurl = form.watch('address').includes(':') ? `http://[${form.watch('address')}]:${form.watch('port')}` : `http://${form.watch('address')}:${form.watch('port')}`

    return (
        <div className="space-y-4">
            <ul className="border rounded-lg p-4 list-disc list-inside">
                {(form.watch("port") != defaultPort || form.watch("address") != defaultAddress) && (
                    <Alert className="border-yellow-500 bg-yellow-100 text-yellow-700 my-2" >
                        <AlertTitle></AlertTitle>
                        <AlertDescription>
                            After applying the changes, you can access the panel using the following URLs:
                        </AlertDescription>
                    </Alert>
                )}
                {form.watch('address') == "0.0.0.0" ? (
                    <div className="flex flex-wrap gap-2 ">
                        <b>ProxyManager Panel Ip's: </b>
                        {!showAll && ips?.slice(0, 2).map((ip, i) => {
                            const url = ip?.includes(':') ? `http://[${ip}]:${form.watch('port')}` : `http://${ip}:${form.watch('port')}`
                            return (
                                <div key={i}>
                                    <a href={url} className="text-blue-500 underline">
                                        {url}
                                    </a>{i < ips?.slice(0, 2).length - 1 ? ',' : (
                                        <span onClick={() => setShowAll(true)} className="text-blue-500 underline ml-2 cursor-pointer">
                                            more...
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                        {showAll && ips?.map((ip, i) => {
                            const url = ip?.includes(':') ? `http://[${ip}]:${form.watch('port')}` : `http://${ip}:${form.watch('port')}`
                            return (
                                <div key={i} >
                                    <a key={i} href={url} className="text-blue-500 underline">
                                        {url}
                                    </a>{i < ips.length - 1 ? ',' : ''}
                                </div>

                            )
                        })}
                    </div>
                ) : (
                    <div>
                        <b>ProxyManager Panel Ip: </b>
                        <a href={singleurl} className="text-blue-500 underline">{singleurl}</a>
                    </div>
                )}
            </ul>
            <ul className="border rounded-lg p-4 list-disc list-inside">
                <li><b>Nginx IPV4 Http: </b> {form.watch("nginxIpv4Address")}:{form.watch("nginxHTTPPort")}</li>
                <li><b>Nginx IPV4 Https: </b> {form.watch("nginxIpv4Address")}:{form.watch("nginxHTTPSPort")}</li>
                {form.watch("enableNginxIpv6") && (
                    <>
                        <li><b>Nginx IPV6 Http: </b> [{form.watch("nginxIpv6Address")}]:{form.watch("nginxHTTPPort")}</li>
                        <li><b>Nginx IPV6 Https: </b> [{form.watch("nginxIpv6Address")}]:{form.watch("nginxHTTPSPort")}</li>
                    </>
                )}
            </ul>

        </div>
    );
}