import { useState } from "react";
import './mettrechner.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function EntryModal({ addEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [noButter, setNoButter] = useState(false);

  const handleAddEntry = () => {
    if (name !== "" && amount > 0){
      addEntry({ name: name, breadRollAmount:amount, noButter:noButter});
      setName("");
      setAmount(0);
      setNoButter(false);
      toggleIsOpen();
    }
  };

  const handleNoButterChange = () => {
    setNoButter(!noButter)
  };

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div id="newEntryBtn">
        <Button color="primary" onClick={toggleIsOpen}>Neuer Eintrag</Button>
      </div>
      <Modal isOpen={isOpen} toggle={toggleIsOpen}>
            <ModalHeader id="modalHeader">
              Neuer Eintrag
              <button className="btn btn-close" onClick={toggleIsOpen}></button>
            </ModalHeader>
            <ModalBody id="modalBody">
              <label htmlFor="name" className="form-label">Name</label><br/>
              <input id="name" className="form-control" type="text" value={name} onChange={(event => setName(event.target.value))}></input><br/>
              <label htmlFor="count" className="form-label">Anzahl Brötchen</label><br/>
              <input id="count" value={amount} className="form-control" type="number" onChange={(event) => setAmount(parseInt(event.target.value))}></input><br/>
              <input id="noButter" className="form-check-input" type="checkbox" checked={noButter} onChange={handleNoButterChange}></input>
              <label htmlFor="noButter" className="form-label">Keine Butter</label>
            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={toggleIsOpen}>Zurück</Button>
            <Button color="primary" onClick={handleAddEntry}>Hinzufügen</Button>
            </ModalFooter>
      </Modal>
    </>
  );
}

function calculateTopping(amount) {
  const mettAmount = amount * 60;
  const butterAmount = amount * 20;

  return [mettAmount, butterAmount];
}

export default function Mettrechner() {
    const [entries, setEntries] = useState([]);
    const [totalBreadRollAmount, setTotalBreadRollAmount] = useState(0);
    const [totalMettAmount, setTotalMettAmount] = useState(0);
    const [totalButterAmount, setTotalButterAmount] = useState(0);

    const addEntry = ({ name, breadRollAmount, noButter}) => {
      setTotalBreadRollAmount(totalBreadRollAmount + breadRollAmount)
      let toppingCalculations = calculateTopping(breadRollAmount);

      setTotalMettAmount(totalMettAmount + toppingCalculations[0]);
      if (noButter) {
        toppingCalculations[1] = 0;
      }
      setTotalButterAmount(totalButterAmount + toppingCalculations[1]);

      setEntries([
        ...entries,
        { name: name, breadRollAmount: breadRollAmount, mett: toppingCalculations[0], butter: toppingCalculations[1] }
      ]);
    };

    const removeEntry = (indexToRemove) => {
      const entry = entries[indexToRemove];
      
      setTotalBreadRollAmount(totalBreadRollAmount - entry.breadRollAmount);
      setTotalMettAmount(totalMettAmount - entry.mett);
      setTotalButterAmount(totalButterAmount - entry.butter);
      setEntries(entries.filter((entry, i) => i !== indexToRemove));
    };
  
    return (
      <>
        <div>
          <EntryModal addEntry={addEntry}/>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brötchen</th>
                <th>Mett / Butter</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.breadRollAmount}</td>
                  <td>{entry.mett}g / {entry.butter}g</td>
                  {/* <td><button id="editEntry" onClick={() => removeEntry(index)}>Bearbeiten</button></td> */}
                  <td><button className="btn btn-close" id="deleteEntry" onClick={() => removeEntry(index)}></button></td>
                </tr>
              ))}
              <tr className="totalAmountRow">
                <td>
                  <strong>Gesamt:</strong>
                </td>
                <td>
                  <strong>{totalBreadRollAmount}</strong>
                </td>
                <td>
                  <strong>{totalMettAmount}g / {totalButterAmount}g</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }