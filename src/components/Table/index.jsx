import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import { TableRow } from '@mui/material';
import { StyledContainer } from './styles';


export default function DeviceTable({ tableCells, rows, setSelected, selected }) {

    console.log(rows);
    return (

        <TableContainer sx={{
            padding: "40px",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            width: 500,
            margin:" 0 auto",
        }} 
        component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

                <TableHead>

                    <TableRow>


                        {tableCells.map((cell, i) => (
                            <React.Fragment key={i}>
                                {i === 0
                                    ? <TableCell key={i}  >{cell}</TableCell>
                                    : <TableCell key={i}   align="right">{cell}</TableCell>
                                }
                            </ React.Fragment>

))}

                    </TableRow>

                </TableHead>

                <TableBody>
                    {rows && rows.map((row, i) => (
                        <TableRow chosen={rows[i].bleAddress === selected} onClick={() => setSelected(row.bleAddress)}  key={i}   sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                            {Object.keys(row).map((key, j) => (
                                
                                <React.Fragment key={j}>

                                

                                    {j === 0
                                        ? <TableCell key={j}  component="th" scope="row">{row[key]}</TableCell>
                                        : <TableCell key={j}   align="right">{row[key]}</TableCell>
                                    }

                                </React.Fragment>

))}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}