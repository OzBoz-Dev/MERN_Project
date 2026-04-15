import { Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { useState } from 'react';

const tags = [
  'react',
  'nodejs',
  'mongodb',
  'docker',
  'linux'
];

interface TagComboProps{
  color: string,
  setTags: (tags: string[]) => void
  selectedTags: string[]
}

export default function TagComboBox({color, setTags, selectedTags}: TagComboProps) {
  const [search, setSearch] = useState('');
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const [value, setValue] = useState<string | null>(null);


  const handleAddTag = (val: string) => {
    if (val){
      if (val.trim() && !selectedTags.includes(val.trim())) {
          setTags([...selectedTags, val.trim()]);
          setValue("");
      }
    }
  }

  const options = tags
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        handleAddTag(val);
        setSearch('');
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          label="Tags"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          styles={{
            input: {
              backgroundColor: "white"
            }
          }}
        >
          {value || <Input.Placeholder>Select tags</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown bg={'#FFFFFF'}>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          onKeyDown={(event) => {
          if (event.key === 'Enter' && search.trim() !== '') {
            handleAddTag(search);
            combobox.closeDropdown();
          }
          }}
          placeholder="Search tags"
          styles={{
            input: {
              backgroundColor: "white"
            }
          }}
        />
        <Combobox.Options mah={100} style={{ overflowY: 'auto' }}>
          {options.length > 0 ? options : <Combobox.Empty>Press enter to add new tag</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}