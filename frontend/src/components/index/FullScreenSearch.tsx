import './FullScreenSearch.css'; //
import { Stack } from '@chakra-ui/react';
import FullScreenSearchBar from './FullScreenSearchBar';

export default function FullScreenSearch({
  recentSearchesList,
}: {
  recentSearchesList: string[];
}){
    return (
        <Stack>
            <div className="full-screen-container">
                <h1>Generate Due Diligence Reports<br></br>Unlock Informed Investments
                </h1>
                <FullScreenSearchBar recentSearchesList={recentSearchesList}/>
            </div>
        </Stack>
    );
};

