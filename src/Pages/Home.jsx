import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
});

const BasicForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        id="name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        id="age"
        name="age"
        label="Age"
        type="number"
        value={formik.values.age}
        onChange={formik.handleChange}
        error={formik.touched.age && Boolean(formik.errors.age)}
        helperText={formik.touched.age && formik.errors.age}
        sx={{ mb: 2 }}
      />
      <Button color="primary" variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default function Home() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("view");
//   console.log("type", type);
  const [currentData, setCurrentData] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const API = "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/getData`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log("err", err));
  }, []);

  const handleAdd = (values) => {
    // console.log("ssjsss", values);
    fetch(`${API}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => {
        setData([...data, res]);
        setType("view");
      })
      .catch((err) => console.log("err", err));
  };

  const handleEdit = (index) => {
    setCurrentData(data[index]);
    setEditIndex(index);
    setType("edit");
  };

  const handleEditSubmit = (values) => {
    fetch(`${API}/${data[editIndex]._id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then(() => {
        return fetch(`${API}/getData`);
      })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setType("view");
      })
      .catch((err) => console.log("err", err));
  };

  const handleDelete = (index) => {
    fetch(`${API}/${data[index]._id}/delete`, {
      method: "DELETE",
    })
      .then(() => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
      })
      .catch((err) => console.log("err", err));
  };

  const handleClose = () => {
    setType("view");
  };

  return (
    <>
      {type === "view" ? (
        <Box sx={{ width: "100%", margin: 3, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography>Table</Typography>
            <AddIcon onClick={() => setType("add")}>Add</AddIcon>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "gray" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Age</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.age}</TableCell>
                    <TableCell align="right">
                      <EditIcon onClick={() => handleEdit(index)}>
                        Edit
                      </EditIcon>
                      <DeleteForeverIcon onClick={() => handleDelete(index)}>
                        Delete
                      </DeleteForeverIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Dialog
          open={type === "add" || type === "edit"}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {type === "add" ? "Add Details" : "Edit Details"}
          </DialogTitle>
          <DialogContent>
            <BasicForm
              initialValues={currentData}
              onSubmit={type === "add" ? handleAdd : handleEditSubmit}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
