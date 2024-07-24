import './FullScreenSearch.css'; //
import { Stack, Heading, useBreakpointValue } from '@chakra-ui/react';
import FullScreenSearchBar from './FullScreenSearchBar';

export default function FullScreenSearch({
  recentSearchesList,
}: {
  recentSearchesList: string[];
}){
  const headingLevel = useBreakpointValue<'h1' | 'h2'>({ base: "h2", md: "h1" });

    return (
        <Stack>
            <div className="full-screen-container">
                <Heading as={headingLevel}>
                  Generate Due Diligence Reports
                  <br />
                  Unlock Informed Investments
                </Heading>
                <FullScreenSearchBar recentSearchesList={recentSearchesList}/>
            </div>
        </Stack>
    );
};

