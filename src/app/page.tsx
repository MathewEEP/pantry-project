"use client";
import styles from "./page.module.css";
import React, { useState, useMemo} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { doc, setDoc, deleteDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCdPvqR_Xd33CrBRIHDLrjBC629qZ5ClkI",
  authDomain: "pantry-project-7ac83.firebaseapp.com",
  projectId: "pantry-project-7ac83",
  storageBucket: "pantry-project-7ac83.appspot.com",
  messagingSenderId: "214428686253",
  appId: "1:214428686253:web:505dd252761eb04649b324"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pantryRef = collection(db, 'pantry');
let rows: string[][] = [];

function initializeTable() {
  getDocs(pantryRef).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      let data = doc.data();
      rows.push([doc.id, data.quantity]);
      console.log(rows);
    })
  }).catch(err => {
    console.log(err);
  });
};

initializeTable();

export default function Home() {
  const [itemText, setItemText] = useState("");
  const [quantityText, setQuantityText] = useState("");


  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'item', headerName: 'Item', width: 90 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      editable: false,
    },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <span className={styles.title}>Pantry Tracker</span>
      </div>
      
      <div className={styles.center}>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row[0]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                {row[0]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row[1]}
                </TableCell>

                <TableCell component="th" scope="row">
                <Button variant="outlined" onClick={() => {
                deleteDoc(doc(db, "pantry", row[0]))
                for (let i = 0; i < rows.length; i++) {
                  if (rows[i][0] === row[0] && rows[i][1] === row[1]) {
                      let spliced = rows.splice(i, 1);
                      break;
                  }
                }
                }
                }>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      <div className={styles.center}>
        <TextField className={styles.input} required id="name" label="item" variant="standard" placeholder="Enter the item" value={itemText} onChange = {(e) => {
               setItemText(e.target.value);
            }}/>
        <TextField className={styles.input} required type="number" id="quantity" label="quantity" variant="standard" placeholder="Enter the quantity" value={quantityText} onChange = {(e) => {
               setQuantityText(e.target.value);
            }}/>
        <Button variant="outlined" onClick={() => {
        setDoc(doc(db, "pantry", itemText), {
          quantity: quantityText
        }).catch(err => {
          console.log(err);
        });
        rows.push([itemText, quantityText]);
        }}>Submit</Button>
      </div>
    </main>
  );
}
