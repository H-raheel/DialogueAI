import { Dispatch, SetStateAction, useState } from 'react';
import { Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface NativeLanguageSelectProps {
  setNativeLang: Dispatch<SetStateAction<string>>
  clearConvo: () => void
}

const { Option } = Select;

// TODO -- the actual icon on the select element doesn't expand the select 

const NativeLanguageSelect = ({ setNativeLang, clearConvo }: NativeLanguageSelectProps) => {
  const [toggle, setToggle] = useState(false)

  const handleChange = (value: string) => {
    setNativeLang(value);
    clearConvo();
  };

  const toggleIcon = () => setToggle(!toggle)

  return (
    <div id="native-lang">
      <label htmlFor="nativeLanguageSelect" 
        style={{
          width: 200,
          padding: "10px 0",
          fontSize: "13px"
        }}
      >
        Native Language
      </label>
      <Select
        id="native-lang-select"
        defaultValue="english"
        style={{ width: 200, backgroundColor: 'white'}}
        onChange={handleChange}
        onDropdownVisibleChange={toggleIcon}
        suffixIcon={toggle ? <UpOutlined /> : <DownOutlined />}
      >
        <Option value="english">English</Option>
        <Option value="spanish">Spanish</Option>
        <Option value="french">French</Option>
        <Option value="japanese">Japanese</Option>
        <Option value="chinese">Chinese</Option>
      </Select>
    </div>
  );
};

export default NativeLanguageSelect;