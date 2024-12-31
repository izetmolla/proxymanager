import { FC } from 'react';
import CreatableSelect from 'react-select/creatable';

interface DomainsTagsInputProps extends React.ComponentProps<typeof CreatableSelect> {

}
const DomainsTagsInput: FC<DomainsTagsInputProps> = ({ ...proos }) => {
    return (
        <CreatableSelect
            isMulti={true}
            placeholder='Enter Domain Names'
            {...proos}
        />
    )
}

export default DomainsTagsInput;