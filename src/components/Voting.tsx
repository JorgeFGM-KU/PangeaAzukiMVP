import { Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { Azuki } from '../shared_code/Azuki';

export default function Voting(props: {
  pickedAzukis: Array<Azuki.AzukiModel>
  addPoints: (azuki: Azuki.AzukiModel, stage: number) => void
  onFinish: (winner: Azuki.AzukiModel) => void
}) {

  //  const [azukis, setAzukis] = useState<Array<Azuki.AzukiModel>>(props.pickedAzukis)
  const [votingState, setVotingState] = useState({
    stage: 1,
    round: 1,
    azukis: props.pickedAzukis
  })
  const remainingAzukis = useRef<Array<Azuki.AzukiModel>>([])

  const renderAzukiCard = (idx: number) => {
    return (
      <Card>
        <CardActionArea onClick={() => onSelectAzuki(idx)}>
          <CardMedia
            component="img"
            height="300"
            image={votingState.azukis[idx].imageURL}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              Azuki #{votingState.azukis[idx].id}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  function onSelectAzuki(idx: number) {
    let aux = [...remainingAzukis.current]
    aux.push(votingState.azukis![idx])
    remainingAzukis.current = aux

    if (idx % 2 == 0) {
      props.addPoints(votingState.azukis[idx+1], votingState.stage)
    } else {
      props.addPoints(votingState.azukis[idx-1], votingState.stage)
    }

    if (votingState.azukis.length == 2) {
      props.onFinish(votingState.azukis[idx])
      return
    }

    if (votingState.round == votingState.azukis.length/2) {
      setVotingState((prev) => {
        return {
          round: 1,
          stage: prev.stage+1,
          azukis: [...remainingAzukis.current]
        }
      })
      remainingAzukis.current = []
    }
    else setVotingState((prev) => {
      return {
        round: prev.round+1,
        stage: prev.stage,
        azukis: prev.azukis
      }
    })
  }

  return <Box>
    {
      votingState.azukis && votingState.azukis.length > 0 ?
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h5">
              Click on your preferred Azuki
            </Typography>
          </Box>
          <Stack direction="row" justifyContent="space-around">
            {renderAzukiCard((votingState.round - 1) * 2)}
            {renderAzukiCard((votingState.round - 1) * 2 + 1)}
          </Stack>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="overline">
              Round: {votingState.round}/{votingState.azukis.length/2} - Stage: {votingState.stage}/4
            </Typography>
          </Box>
        </> :
        <CircularProgress />
    }
  </Box>
}
