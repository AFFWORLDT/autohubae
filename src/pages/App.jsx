import { BrowserRouter, Routes, Route } from "react-router-dom";
import VehicleReport from "./vehicles/VehicleReport";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/vehicles/:vehicleId/report" element={<VehicleReport />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App; 