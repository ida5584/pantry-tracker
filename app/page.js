'use client'
import {Box, Stack, Typography, Button, Modal, TextField, IconButton} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { firestore } from './firebase';
import { collection, query, getDocs, getDoc, setDoc, doc, deleteDoc} from 'firebase/firestore';
import { useEffect, useState} from 'react';

// const items = [
//   'tomato',
//   'potato',
//   'onion',
//   'garlic',
//   'carrot',
//   'apple',
//   'banana',
//   'chicken',
//   'beef',
//   'rice',
//   'broccoli',
//   'cheese',
//   'olive oil',
//   'milk',
//   'eggs'
// ]

// 5 food categories: Fruits, Vegetables, Grains, Protein Foods, and Dairy
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push( {
        name: doc.id,
        ...doc.data(),
      })
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  const addItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'pantry'), itemName)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      const {quantity} = snapshot.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updatePantry()
  }

  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'pantry'), itemName)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      const {quantity} = snapshot.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updatePantry()
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display={'flex'} 
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField 
              id="outlined-basic" 
              label="Item" 
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button 
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            > Add </Button>
          </Stack>
          
        </Box>
      </Modal>
      <Button 
        color="secondary"
        variant="contained"
        onClick={handleOpen}  
      > Add new item </Button>
      <Box 
        sx={{
          border:'2px solid #333',
          borderRadius: 3,
        }}
      >
        <Box 
           sx={{
            borderRadius: 3,
            width:"800px",
            height:"100px", 
            bgcolor:'#FFB6C1', 
            display:'flex', 
            justifyContent:'center', 
            alignItems:'center', 
          }}

        >
          <Typography variant='h2' color={'#333'} textAlign={'center'}>
          Pantry Item
          </Typography>
        </Box>
        <Stack 
          width="800px" 
          height="300px"
          spacing={2}
          overflow={'auto'}
        >
          {pantry.map(({name, quantity}) => (
            <Box
              key={name}
              width='100%'
              minHeight='100px'
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              padding={10}
            >
              <Typography variant={'h4'} color={'#333'} textAlign={'center'} >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h4'} color={'#333'} textAlign={'center'} >
                {quantity}
              </Typography>
              <Box
                minWidth='150px'
              >
                <IconButton 
                  aria-label="add to shopping cart" 
                  size="large"
                  onClick={() => {
                    handleOpen
                    addItem(name)
                    handleClose
                  }}
                  >
                  <AddBoxRoundedIcon />
                </IconButton>

                <IconButton 
                  aria-label="delete" 
                  size="large"
                  variant="outlined"
                  onClick={() => {
                    handleOpen
                    removeItem(name)
                    handleClose
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>

              </Box>
            </Box>
          ))}

        </Stack>
      </Box>
    </Box>
  );
}
