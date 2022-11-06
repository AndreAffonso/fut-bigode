import { atom, useAtom } from "jotai";
import type { NextPage } from "next";
import { useState } from "react";
import {
  Button,
  Input,
  Flex,
  FormControl,
  FormLabel,
  Box,
  Stack,
  IconButton,
  Text,
  Heading,
} from "@chakra-ui/react";

import { AddIcon, CheckIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { UniformSVG } from "../images/uniformSVG";

const colors: [string, string][] = [
  ["#74aada", "#e6e6e9"],
  ["#23351a", "#fadd00"],
  ["#d91f12", "#fbd313"],
  ["#fadd00", "#158d37"],
  ["#158d37", "#1f4c9d"],
  ["#262863", "#ececec"],
  ["#333333", "#ececec"],
  ["#18a036", "#dd1b01"],
  ["#dd1b01", "#efeeee"],
  ["#642f38", "#1d1937"],
  ["#169047", "#333333"],
  ["#e6e6e9", "#e6332a"],
  ["#e6332a", "#158d37"],
];

const getRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length);

  return colors[index];
};

const numberOfPlayersAtom = atom<number>(5);
const playersAtom = atom<string[]>([]);
const sortedPlayersAtom = atom<string[]>([]);

const sortPlayers = (players: string[]) => {
  const aux = [...players];
  return aux.sort(() => 0.5 - Math.random());
};

const teamsAtom = atom((get) => {
  const numberOfPlayers = get(numberOfPlayersAtom);
  const sortedPlayers = get(sortedPlayersAtom);

  const teams: string[][] = [];

  const numberOfTeams = Math.floor(sortedPlayers.length / numberOfPlayers);
  const substitutes = sortedPlayers.length % numberOfPlayers;

  if (numberOfTeams === 0 && sortedPlayers.length) return [sortedPlayers];

  sortedPlayers.forEach((player, index) => {
    const isSubstitute = sortedPlayers.length - (index + 1) < substitutes;
    const teamIndex = isSubstitute ? numberOfTeams : index % numberOfTeams;

    if (!teams[teamIndex]) {
      teams[teamIndex] = [];
    }

    teams[teamIndex].push(player);
  });

  return teams;
});

const Teams = () => {
  const [teams] = useAtom(teamsAtom);
  const [, setSortedPlayers] = useAtom(sortedPlayersAtom);

  const clearSortedPlayers = () => setSortedPlayers([]);

  return (
    <Flex
      flexDirection="column"
      flex={1}
      w="full"
      height="full"
      justifyContent="space-between"
    >
      <Stack flex={1} w="full">
        {teams.map((team, index) => {
          const color = getRandomColor();
          return (
            <Box key={index}>
              <Heading size="small">Time {index + 1}</Heading>

              {team.map((t, i) => {
                return (
                  <Box key={i} display="flex" alignItems="center">
                    <UniformSVG firstColor={color[0]} secondColor={color[1]} />
                    <Text ml={2} fontWeight="bold">
                      {t}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Stack>

      <Flex pt={2}>
        <Button colorScheme="blue" onClick={clearSortedPlayers} w="full">
          Sortear novamente
        </Button>
      </Flex>
    </Flex>
  );
};

const PlayersInput = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useAtom(numberOfPlayersAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [newPlayer, setNewPlayer] = useState("");
  const [sortedPlayers, setSortedPlayers] = useAtom(sortedPlayersAtom);
  const onSortPlayers = () => setSortedPlayers(sortPlayers(players));

  const incNumberOfPlayers = () => setNumberOfPlayers((prev) => prev + 1);
  const decNumberOfPlayers = () =>
    setNumberOfPlayers((prev) => (prev > 1 ? prev - 1 : prev));

  const onAddNewPlayer = (event: any) => {
    event.preventDefault();
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayer("");
  };

  const onEditPlayer = (value: string, indexToEdit: number) =>
    setPlayers((prev) =>
      prev.map((player, index) => (index === indexToEdit ? value : player))
    );

  const onRemovePlayer = (indexToRemove: number) =>
    setPlayers((prev) => prev.filter((p, index) => index !== indexToRemove));

  const isTeamsCompletes = players.length > 0;

  return (
    <Flex
      flexDirection="column"
      flex={1}
      height="full"
      justifyContent="space-between"
    >
      <Box flex={1}>
        <Flex
          mb={10}
          alignItems="center"
          w="100%"
          justifyContent="space-between"
        >
          <Text mr={4} fontSize="1xl">
            Jogadores em cada time{" "}
          </Text>
          <Box display="flex">
            <IconButton
              onClick={decNumberOfPlayers}
              aria-label=""
              icon={<MinusIcon />}
              colorScheme="teal"
              size="sm"
            />
            <Text fontWeight="bold" fontSize="2xl" px={2}>
              {numberOfPlayers}
            </Text>
            <IconButton
              onClick={incNumberOfPlayers}
              aria-label=""
              icon={<AddIcon />}
              colorScheme="teal"
              size="sm"
            />
          </Box>
        </Flex>

        <Stack mb={4}>
          {players.map((player, index) => (
            <FormControl display="flex" alignItems="center" key={index}>
              <FormLabel minW="86px" htmlFor={`player-${index}`}>
                Jogador {index + 1}
              </FormLabel>
              <Input
                mr={2}
                type="text"
                id={`player-${index}`}
                value={player}
                placeholder="nome"
                onChange={(event) => onEditPlayer(event.target.value, index)}
              />
              <IconButton
                onClick={() => onRemovePlayer(index)}
                icon={<DeleteIcon />}
                colorScheme="red"
                aria-label=""
              />
            </FormControl>
          ))}
          <Flex alignItems="center" as="form" onSubmit={onAddNewPlayer}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="new-player" minW="86px">
                Jogador {players.length + 1}
              </FormLabel>
              <Input
                mr={2}
                type="text"
                id="new-player"
                placeholder="Nome do jogador"
                onChange={(e) => setNewPlayer(e.target.value)}
                value={newPlayer}
              />
              <IconButton
                type="submit"
                colorScheme="green"
                icon={<CheckIcon />}
                aria-label=""
                disabled={!newPlayer}
              />
            </FormControl>
          </Flex>
        </Stack>
      </Box>

      <Flex pt={2}>
        <Button
          disabled={!isTeamsCompletes}
          colorScheme="blue"
          onClick={onSortPlayers}
          w="full"
        >
          Sortear times
        </Button>
      </Flex>
    </Flex>
  );
};

const Home: NextPage = () => {
  const [teams] = useAtom(teamsAtom);

  return (
    <Box
      p={8}
      bg="gray.100"
      minH="100vh"
      w="100vw"
      display="flex"
      alignItems="center"
      flexDirection="column"
      pb={20}
    >
      <Box mb={4}>
        <Heading as="h1">Fut Bigode</Heading>
      </Box>
      {teams.length ? <Teams /> : <PlayersInput />}
    </Box>
  );
};

export default Home;
