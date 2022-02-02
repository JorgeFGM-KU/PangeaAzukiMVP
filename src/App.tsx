import { Link, Login, ThumbUp } from '@mui/icons-material';
import { Button, Card, CardContent, CardMedia, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Results from './components/Results';
import Voting from './components/Voting';
import { Azuki } from './shared_code/Azuki';
import { EthereumAddress } from './shared_code/Ethereum';
import { MetaMask } from './shared_code/MetaMask';


export default function App() {

  enum DownAreaStatus {
    AzukiPreview,
    Voting,
    Results,
  }

  const [metaMaskState, setMetaMaskState] = useState<MetaMask.State>(MetaMask.State.Initial)
  const [userOwnsAzuki, setUserOwnsAzuki] = useState<boolean | undefined>(undefined)
  const [downAreaStatus, setDownAreaStatus] = useState<DownAreaStatus>(DownAreaStatus.AzukiPreview)
  const metaMaskProvider = useRef<any>(undefined)
  const userAddress = useRef<EthereumAddress | null>(null)
  const [pickedAzukis, setPickedAzukis] = useState<Array<Azuki.AzukiModel>>([])
  const points = useRef<Array<number>>([])

  useEffect(() => {
    points.current = Array.from(('0').repeat(32)).map((v) => Number(v))
    Azuki.getRandomAzukis().then((azukis) => setPickedAzukis(azukis))
    MetaMask.getProviderIfInstalled()
      .then((provider) => {
        provider.on("accountsChanged", (addresses: Array<EthereumAddress>) => {
          if (metaMaskState != MetaMask.State.Installed) setMetaMaskState(MetaMask.State.Installed)
        })
        provider.on("chainChanged", () => {
          if (metaMaskState != MetaMask.State.Installed) setMetaMaskState(MetaMask.State.Installed)
          window.location.reload();
        })
        metaMaskProvider.current = provider
        setMetaMaskState(MetaMask.State.Installed)
      })
      .catch(() => setMetaMaskState(MetaMask.State.NotInstalled))
  }, [])

  useEffect(() => {
    if (userAddress.current)
      Azuki.ownsAnyAzuki(userAddress.current!).then((owns) => setUserOwnsAzuki(owns))
      // Azuki.ownsAnyAzuki(userAddress.current!).then((owns) => setUserOwnsAzuki(true)) // Comment the line above and uncomment this one if ypu don't own Azuki but wanna try!
  }, [userAddress.current])

  function addPointsOnSelect(azuki: Azuki.AzukiModel, stage: number) {
    let idx = pickedAzukis.indexOf(azuki)
    points.current[idx] = Math.pow(2, stage - 1) > 1 ? Math.pow(2, stage - 1) : 0
  }

  function onFinish(winner: Azuki.AzukiModel) {
    let idx = pickedAzukis.indexOf(winner)
    points.current[idx] = 32
    setDownAreaStatus(DownAreaStatus.Results)
  }

  const noMetaMaskDialog = () => {
    return (
      <Dialog
        open={metaMaskState == MetaMask.State.NotInstalled}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Is MetaMask installed?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            MetaMask could not be detected.
            You need to have MetaMask installed in order to start this app.
            Please install MetaMask and refresh the site.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { window.location.reload(); setMetaMaskState(MetaMask.State.Initial); }}>Refresh</Button>
        </DialogActions>
      </Dialog>
    )
  }
  const noOwnedAzukiDialog = () => {
    return (
      <Dialog
        open={metaMaskState == MetaMask.State.Connected && (userOwnsAzuki != undefined && userOwnsAzuki == false)}
      >
        <DialogTitle>
          {"Do you own any Azuki?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Seems like the address you are using does not own any of the Azuki assets. Please change to another account or acquire one of the Azuki NFTs and refresh the site.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { window.location.reload(); setMetaMaskState(MetaMask.State.Initial); setUserOwnsAzuki(undefined) }}>Refresh</Button>
        </DialogActions>
      </Dialog>
    )
  }
  const loginWithMetaMaskButton = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="outlined" endIcon={<Login />} style={{ margin: "auto" }} onClick={() => {
          MetaMask.connectAndGetAddress(metaMaskProvider.current!)
            .then((address) => {
              userAddress.current = address
              setMetaMaskState(MetaMask.State.Connected)
            })
        }
        }>Login with MetaMask</Button>
      </Box>
    )
  }
  const startVotingButton = () => {
    return (
      <Button
        variant="outlined"
        disabled={metaMaskState == MetaMask.State.Connected && (userOwnsAzuki == undefined || userOwnsAzuki == false)}
        endIcon={<ThumbUp />}
        onClick={() => setDownAreaStatus(DownAreaStatus.Voting)}
      >
        Start voting
      </Button>
    )
  }
  const explanationText = () => {
    return (
      <Box>
        <Typography variant="h2">Welcome to Azuki World Cup</Typography>
        <Typography variant="body1">When you start the voting, you will be shown 2 different Azuki assets among the 32 randomnly picked ones. Select the one you like the most between the two to classify it for the next round. When only the winner is left, a ranking with the points assigned to each Azuki will be shown.</Typography>
        <Typography variant="subtitle2">Remember that in order to be able to vote, you must own at least one of the assets in the Azuki collection!</Typography>
      </Box>
    )
  }
  const azukisPreview = () => {
    return (
      <Grid container spacing={2}
      >
        {
          pickedAzukis.map((azuki) => {
            return <Grid item><Card>
              <CardMedia
                component="img"
                height="120"
                image={azuki.imageURL}
              />
            </Card>
            </Grid>
          })
        }
      </Grid>
    )
  }

  return (
    <>
      {noMetaMaskDialog()}
      {noOwnedAzukiDialog()}
      <Container>
        <Box>
          <Stack spacing={2}>
            {explanationText()}
            {
              metaMaskState == MetaMask.State.Initial ?
                <CircularProgress /> :
                metaMaskState == MetaMask.State.Installed ?
                  loginWithMetaMaskButton() :
                  metaMaskState == MetaMask.State.Connected ?
                    <Stack spacing={1}>
                      <Chip label={"Connected with address: " + userAddress.current} icon={<Link />} />
                      {
                        downAreaStatus == DownAreaStatus.AzukiPreview ? startVotingButton() : null
                      }
                      {
                        downAreaStatus == DownAreaStatus.Voting ?
                          <Voting
                            pickedAzukis={pickedAzukis}
                            addPoints={addPointsOnSelect}
                            onFinish={onFinish}
                          /> :
                          downAreaStatus == DownAreaStatus.Results ?
                            <Results
                              points={points.current}
                              azukis={pickedAzukis}
                            /> : azukisPreview()
                      }
                    </Stack>
                    : null
            }
          </Stack>
        </Box>
      </Container>
    </>
  );
}
