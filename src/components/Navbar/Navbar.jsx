import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import ImageWithLoading from '../helper/ImageWithLoading';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Dropdown,
  DropdownButton,
  DropdownItems,
  DropdownItem,
} from '../Ui/Dropdown/Dropdown';
import { USER_PROFILE_PATH } from '../../common/routes';

export default function Navbar() {
  const { currentUserProfile, loading, logout } = useAuth();
  const { isAuthenticated } = useFirebaseAuth();

  const navigate = useNavigate();

  const logoutNavbar = () => {
    logout();
    navigate('/signin');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
              </div>
              {/* Profile dropdown */}
              {isAuthenticated && (
                <>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                    </button>

                    {!loading && (
                      <Dropdown>
                        <DropdownButton
                          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          id="user-menu-button"
                          aria-expanded="false"
                          data-dropdown-toggle="user-dropdown"
                          data-dropdown-placement="bottom"
                        >
                          <ImageWithLoading
                            className="w-24 h-24 mb-3 rounded-full shadow-lg"
                            src={currentUserProfile.profilePictureURL}
                            alt="Some image"
                            width="2rem"
                            height="2rem"
                          />
                        </DropdownButton>
                        <DropdownItems>
                          <DropdownItem
                            to={USER_PROFILE_PATH(currentUserProfile.username)}
                            title="Your Profile"
                          />
                          <DropdownItem title="Logout" onClick={logoutNavbar} />
                        </DropdownItems>
                      </Dropdown>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
