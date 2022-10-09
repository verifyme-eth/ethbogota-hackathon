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
    <Box pt="1rem" pb="1rem">
      <SimpleGrid columns={3} spacing="1.5rem">
        {length > 11 ? (
          <>
            {arr
              .map((poap: any) => (
                <Box key={poap.name}>
                  <Center>
                    <Avatar name={poap.name} src={poap.image_url} size="lg" />
                  </Center>
                </Box>
              ))
              .slice(0, 11)}
            <Box>+ {diff}</Box>
          </>
        ) : (
          <>
            {arr.map((poap: any) => (
              <Box key={poap.name}>
                <Center>
                  <Avatar name={poap.name} src={poap.image_url} size="lg" />
                </Center>
              </Box>
            ))}
          </>
        )}
      </SimpleGrid>
    </Box>
  );
}
