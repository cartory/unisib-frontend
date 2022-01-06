/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';

import {
    Fab,
    Grid,
    Paper,
    Button,
    TextField,

    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Typography,
    Snackbar,

    Select,
    MenuItem,
    InputLabel,

    makeStyles,
    FormControl,
} from '@material-ui/core'

import { Alert } from '@material-ui/lab'

import {
    Save as SaveIcon,
    Edit as EditIcon,
    Remove as RemoveIcon,
    Replay as ReplayIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons'

import Title from './utils/Title';

const URL = "http://localhost:8000/api/ubicaciones";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

const DataTable = props => {
    const [open, setOpen] = React.useState(false);

    const { data, editMode, setState } = props;

    const onDelete = async id => {
        try {
            await fetch(`${URL}/${id}`, { method: "DELETE" })
            setState(true);
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }

    return (
        <>
            <Table size="small" >
                <TableHead>
                    <TableRow>
                        <TableCell size="small"><strong>ID</strong></TableCell>
                        <TableCell align="center"><strong>Tipo</strong></TableCell>
                        <TableCell><strong>Nombre</strong></TableCell>
                        <TableCell><strong>Descripción</strong></TableCell>
                        <TableCell align="center"><strong>Ubi</strong></TableCell>
                        <TableCell align="center"><strong>Ubis</strong></TableCell>
                        <TableCell size="small"><strong>Acción</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.map(row => (
                            <TableRow
                                id={row.id}
                                key={row.id}
                                onMouseOver={() => {
                                    document
                                        .getElementById(row.id)
                                        .style.backgroundColor = "#ebf5fc"
                                }}
                                onMouseLeave={() => {
                                    document
                                        .getElementById(row.id)
                                        .style.backgroundColor = "inherit"
                                }}
                            >
                                <TableCell size="small"><strong>{row.id}</strong></TableCell>
                                <TableCell align="center">
                                    <Fab
                                        disabled
                                        variant="extended"
                                        size="small"
                                        style={{
                                            color: "black"
                                        }}
                                    >{row.tipo}
                                    </Fab>
                                </TableCell>
                                <TableCell align="center">{row.nombre}</TableCell>
                                <TableCell>{row.descripcion}</TableCell>
                                <TableCell align="center">
                                    <Fab
                                        disabled
                                        size="small"
                                        variant="extended"
                                        style={{
                                            color: "black"
                                        }}
                                    >{row.ubicacion ?? <RemoveIcon />}
                                    </Fab>
                                </TableCell>
                                <TableCell align="center">
                                    <Fab
                                        disabled
                                        size="small"
                                        variant="extended"
                                        style={{
                                            color: "black"
                                        }}
                                    >{row.ubicaciones}
                                    </Fab>
                                </TableCell>
                                <TableCell align="center" size="small">
                                    <Grid container direction="row">
                                        <Grid item title="edit">
                                            <a
                                                href="#" alt="#"
                                                style={{ color: "green" }}
                                                onClick={() => editMode(row)}
                                            >
                                                <EditIcon />
                                            </a>
                                        </Grid>
                                        <Grid item>
                                            <a
                                                href="#" alt="#"
                                                style={{ color: "indianred" }}
                                                onClick={() => onDelete(row.id)}
                                            >
                                                <DeleteIcon />
                                            </a>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    color="error"
                    elevation={0}
                    variant="standard"
                    onClose={handleClose}
                >
                    Eliminado Correctamente
                </Alert>
            </Snackbar>
        </>
    );
}

const Form = props => {
    const [open, setOpen] = React.useState(false);
    const {
        classes,
        edit = false, ubi, ubis,
        setUbi, setState, setEdit
    } = props;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }

    const tipos = [
        "Universidad", "Facultad", "Sección", "Librero", "Estante"
    ];

    const onSubmit = async event => {
        event.preventDefault();
        try {
            await fetch(`${URL}/${edit ? ubi.id : ""}`, {
                method: edit ? "PUT" : "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify(ubi)
            })
            setState(true);
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    }

    const onInput = target => {
        const { name, value } = target;
        ubi[name] = value === 0 ? null : value;
        setUbi(ubi);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    alignContent="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            required={!edit}
                            name="nombre"
                            label="Nombre"
                            autoComplete="given-name"
                            helperText={edit ? ubi.nombre : null}
                            onInput={e => onInput(e.target)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            multiline
                            name="descripcion"
                            label="Descripción"
                            autoComplete="family-name"
                            helperText={edit ? ubi.descripcion : null}
                            onInput={e => onInput(e.target)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="max-width">Tipo Ubi</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                required={!edit}
                                fullWidth
                                name="tipo"
                                defaultValue={ubi["tipo"] ?? ""}
                                onChange={event => onInput(event.target)}
                            >
                                {tipos.map(tipo => (
                                    <MenuItem key={tipo} alignItems="center" value={tipo}>{tipo}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="max-width">Pertenece a</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                fullWidth
                                name="ubicacionID"
                                defaultValue={ubi["tipo"] ?? "0"}
                                onChange={event => onInput(event.target)}
                            >
                                <MenuItem key={0} value={0}>Ninguna</MenuItem>
                                {ubis.map(ubi => (
                                    <MenuItem key={ubi.id} value={ubi.id}>{ubi.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={edit ? { backgroundColor: "green" } : {}}
                            className={classes.button}
                            startIcon={<SaveIcon />}
                        >Guardar</Button>
                        <Button
                            type="reset"
                            variant="contained"
                            onClick={() => {
                                delete ubi.id
                                setEdit(false)
                            }}
                            size="small"
                            className={classes.button}
                            startIcon={< ReplayIcon />}
                        >Limpiar</Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    color={edit ? "success" : "info"}
                    elevation={0}
                    variant="standard"
                    onClose={handleClose}
                >
                    Guardado Correctamente
                </Alert>
            </Snackbar>
        </>
    );
}

export const PUbicacion = props => {
    const classes = useStyles();

    const [ubi, setUbi] = React.useState({});
    const [data, setData] = React.useState([]);

    const [edit, setEdit] = React.useState(false);
    const [state, setState] = React.useState(true);

    const editMode = row => {
        setEdit(true);
        setUbi(row);
    }

    React.useEffect(() => {
        if (state) {
            setState(false);
            fetch(URL)
                .then(async res => setData(await res.json()))
                .catch(err => console.error(err))
        }
    }, [state]);

    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom color="primary">
                <strong>GESTIONAR UBICACIÓN</strong>
            </Typography>
            <Grid
                container
                direction="row"
                spacing={5}
                alignItems="flex-start"
            >
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                        <Title>
                            {edit ? "Editar " : "Crear "}Ubicación
                        </Title>
                        <Form
                            classes={classes}
                            edit={edit} ubi={ubi}
                            setUbi={setUbi}
                            setEdit={setEdit}
                            setState={setState}
                            ubis={data.filter(row => ubi.id !== row.id)}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper className={classes.paper}>
                        <Title>Ver Ubicaciones</Title>
                        <DataTable
                            data={data}
                            setState={setState}
                            editMode={editMode}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment >
    );
}