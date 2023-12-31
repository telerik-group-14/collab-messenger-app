import useLoadUserProfiles from '../../hooks/useLoadUserProfiles';
import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import {
  Dropdown,
  DropdownButton,
  DropdownItems,
  DropdownItem,
} from '../Ui/Dropdown/Dropdown';
import { UsersTableRow } from './UsersTableRow';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useConversation from '../../hooks/useConversation';
import { CONVERSATION_PATH } from '../../common/routes';
import SearchBar from '../Ui/SearchBar';

export default function Users() {
  const { userProfiles, loading } = useLoadUserProfiles();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

  const navigate = useNavigate();

  const { author, conversationId, setParticipants } = useConversation();

  const checkboxChangeHandler = (userProfile, isChecked) => {
    if (isChecked) {
      setSelectedUsers((prevSelectedUsers) => [
        ...prevSelectedUsers,
        userProfile,
      ]);
    } else {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user.id !== userProfile.id)
      );
    }
  };

  const sendGroupMessageHandler = useCallback(() => {
    const allParticipants = [author, ...selectedUsers];
    setParticipants(allParticipants);
  }, [author, selectedUsers, setParticipants]);

  const searchHandler = (filteredUsers, searchValue) => {
    setFilteredUsers(filteredUsers);
    setSearchValue(searchValue);
  };

  useEffect(() => {
    if (conversationId) {
      navigate(CONVERSATION_PATH(conversationId));
    }
  }, [conversationId, navigate]);

  useEffect(() => {
    if (loading) {
      return;
    }

    setFilteredUsers(userProfiles);
  }, [userProfiles, loading]);

  return (
    <div className="p-6 flex-1 flex flex-col page-with-bg">
      <div className="h-18">
        <Heading title="Registered Users" />
      </div>

      {loading && <LoadingIndicator />}

      {!loading && (
        <div className="flex-1 flex flex-col">
          {/* Action Dropdown & Search Bar */}
          <div className="flex h-18 items-center justify-between flex-column flex-wrap md:flex-row md:space-y-0 mb-4 bg-white dark:bg-gray-900">
            {/* Action Button */}
            <div>
              <Dropdown>
                <DropdownButton
                  id="dropdownActionButton"
                  data-dropdown-toggle="dropdownAction"
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  type="button"
                >
                  <span className="sr-only">Action button</span>
                  Group messages
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </DropdownButton>
                <DropdownItems dropdownDirection="left">
                  <DropdownItem
                    title="Send Group Message"
                    onClick={sendGroupMessageHandler}
                  />
                </DropdownItems>
              </Dropdown>

              {/* <!-- Dropdown menu --> */}
              <div
                id="dropdownAction"
                className="z-10 hidden bg-white bg-opacity-50 divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownActionButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Reward
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Promote
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Activate account
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Delete User
                  </a>
                </div>
              </div>
            </div>

            <SearchBar allUsers={userProfiles} onSearch={searchHandler} />
          </div>
          {/*
          {searchValue && (
            <>
              <Heading
                title={`Found ${filteredUsers.length} results for "${searchValue}"`}
              />
            </>
          )}

          {filteredUsers.length === 0 && (
            <Heading
              title={`Try different keywords. You can search by username, first name, last name, email, or phone number.`}
            />
          )} */}

          <div className="w-full flex-1 relative overflow-auto">
            <table className="text-sm w-full absolute text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center"></div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((userProfile) => {
                  return (
                    <UsersTableRow
                      key={userProfile.id}
                      userProfile={userProfile}
                      onCheckboxChange={checkboxChangeHandler}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
