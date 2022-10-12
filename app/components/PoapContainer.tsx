import { Avatar, Box, Center, SimpleGrid } from "@chakra-ui/react";

type PoapContainerProps = {
  arr: any;
  length: number;
  diff: number;
};

export default function PoapContainer({
  arr,
  length,
  diff,
}: PoapContainerProps) {
  return (
    <Box p="2">
      <SimpleGrid columns={4} spacing="1rem">
        {length > 11 ? (
          <>
            {arr
              .map((poap: any) => (
                <Box key={poap.id}>
                  <Center>
                    <Avatar name={poap.name} src={poap.image_url} size="md" />
                  </Center>
                </Box>
              ))
              .slice(0, 11)}

            <Box m="auto">+ {diff}</Box>
          </>
        ) : (
          <>
            {arr.map((poap: any) => (
              <Box key={poap.id}>
                <Center>
                  <Avatar name={poap.name} src={poap.image_url} size="md" />
                </Center>
              </Box>
            ))}
          </>
        )}
      </SimpleGrid>
    </Box>
  );
}
