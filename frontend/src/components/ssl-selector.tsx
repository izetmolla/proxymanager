import { getSslKeysSearch } from '@/services/ssl.service';
import { debounce } from '@/utils/debounce';
import { FC } from 'react';
import Select from 'react-select/async';


interface Props {
    onChange: (value: string) => void
    defaultValue?: { value: string | number; label: string }[]
    value?: { value: string | number; label: string }
}
export const SslSelector: FC<Props> = ({
    onChange,
    value,
    defaultValue
}) => {
    const getTeamsFn = debounce((name: string, callback: (options: { value: string | number; label: string }[]) => void) => {
        if (name.length > 0) {
            getSslKeysSearch(name).then((res) => res.data).then(({ error, data }) => {
                if (error) {
                    callback([])
                    return
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                callback((data as any) ?? [])
            }).catch((err) => {
                console.log("Err: ", err)
                callback([])
            })
        }
    }, 500);


    return (
        <div className='z-11'>
            <Select
                classNamePrefix="react-select"
                styles={{
                    menu: (provided) => ({ ...provided, zIndex: 999 })
                }}
                // value={selected ? { value: selected, label: selected } : undefined}
                cacheOptions
                loadOptions={getTeamsFn}
                onChange={(x) => {
                    if (x?.value) {
                        onChange(x?.value as string)
                    }
                }}
                defaultValue={defaultValue}
                value={value}
            />
        </div>
    )
}