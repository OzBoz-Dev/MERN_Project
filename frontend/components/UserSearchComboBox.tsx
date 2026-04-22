import { API_ENTRYPOINT } from '@/constants/constants';
import { CheckIcon, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine/core';
import { useEffect, useState } from 'react';

interface Props {
  color: string;
  setUsers: (users: string[]) => void;
  selectedUsers: string[];
}

export function UserSearchComboBox({ color, setUsers, selectedUsers }: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUserList([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_ENTRYPOINT}/profile/search/${query}`);
      if (response.ok) {
        const data = await response.json();
        setUserList(data.map((user: any) => user.username));
      } else {
        setUserList([]);
      }
    } catch (err) {
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search);
  }, [search]);

  const handleValueSelect = (val: string) => {
    if (selectedUsers.includes(val)) {
      setUsers(selectedUsers.filter((u) => u !== val));
    } else {
      setUsers([...selectedUsers, val]);
    }
  };

  const handleValueRemove = (val: string) =>
    setUsers(selectedUsers.filter((u) => u !== val));

  const values = selectedUsers.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = userList.map((item) => (
    <Combobox.Option value={item} key={item} active={selectedUsers.includes(item)}>
      <Group gap="sm">
        {selectedUsers.includes(item) ? <CheckIcon size={12} /> : null}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
      styles={{ dropdown: { background: color }, option: { color: '#000000' } }}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          styles={{ input: { background: '#ffffff', color: '#000000' } }}
          onClick={() => combobox.openDropdown()}
        >
          <Pill.Group>
            {values}
            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search users"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0 && selectedUsers.length > 0) {
                    event.preventDefault();
                    handleValueRemove(selectedUsers[selectedUsers.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {loading ? (
            <Combobox.Empty>Loading...</Combobox.Empty>
          ) : options.length > 0 ? (
            options
          ) : search.trim() ? (
            <Combobox.Empty>No users found</Combobox.Empty>
          ) : null}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}