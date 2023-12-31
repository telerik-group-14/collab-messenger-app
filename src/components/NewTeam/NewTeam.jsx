import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Ui/Button';
import InputSection from '../Ui/InputSection';
import {
  MIN_TEAM_NAME_LENGTH,
  MAX_TEAM_NAME_LENGTH,
} from '../../common/constants';
import { addTeam, checkIfTeamNameExists } from '../../services/teams.service';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { createChannel } from '../../services/channel.service';

export default function NewTeam() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState();
  const { user } = useFirebaseAuth();
  const { uid: userUid } = useUserProfile();

  const teamNameChangeHandler = (event) => {
    setTeamName(event.target.value);
  };

  const createTeam = async () => {
    if (
      teamName.length < MIN_TEAM_NAME_LENGTH ||
      teamName.length > MAX_TEAM_NAME_LENGTH
    ) {
      toast.error('Name must be between 3 and 40 symbols.');
      return;
    }

    const teamNameExists = await checkIfTeamNameExists(teamName);

    if (teamNameExists) {
      toast.error(`The team name ${teamName} already exists.`);
      return;
    }

    try {
      const teamUid = await addTeam(userUid, teamName);
      await createChannel(teamUid, 'general', user.uid);
      toast.success('New team was created');
      navigate('/teams');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center pt-6 bg-gray-50">
        <div>
          <Link to="/">
            <h3 className="text-sm font-bold text-gray-600">Create Team</h3>
          </Link>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
          <form>
            <div className="mb-4">
              <InputSection
                onChange={teamNameChangeHandler}
                label="Team Name"
                type="text"
              />
            </div>

            <Button title="Create" onClick={createTeam} />
          </form>
        </div>
      </div>
    </>
  );
}
