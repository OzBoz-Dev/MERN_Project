import { API_ENTRYPOINT } from '@/constants/constants';
import { Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { useState, useEffect } from 'react';

interface TagComboProps {
  color: string;
  setTags: (tags: string[]) => void;
  selectedTags: string[];
}

export default function TagComboBox({ color, setTags, selectedTags }: TagComboProps) {
  const [search, setSearch] = useState('');
  const [tags, setTagsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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

  const fetchTags = async (query: string) => {
    if (!query.trim()) {
      setTagsList([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_ENTRYPOINT}/tags/${query}`);
      if (response.ok) {
        const data = await response.json();
        setTagsList(data.map((tag: any) => tag.value));
      } else {
        setTagsList([]);
      }
    } catch (err) {
      setTagsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags(search);
  }, [search]);

  const handleAddTag = (val: string) => {
    if (val) {
      const trimmedVal = val.trim().toLowerCase();
      if (trimmedVal && !selectedTags.includes(trimmedVal)) {
        setTags([...selectedTags, trimmedVal]);
        setSearch('');
      }
  };
}

  const options = tags.map((tag: string) => (
    <Combobox.Option value={tag} key={tag}>
      {tag}
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
          {search.length > 0 ? search : <Input.Placeholder>Select tags</Input.Placeholder>}
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