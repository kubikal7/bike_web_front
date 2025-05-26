import React, { useState } from "react";
import LayoutAdmin from "../Components/LayoutAdmin";

function Admin() {
  const token = localStorage.getItem("token") || "";


  return (
    <LayoutAdmin>

    </LayoutAdmin>
  );
}

export default Admin;
