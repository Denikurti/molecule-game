import { motion } from "framer-motion";
import { elementColors, elementRadii } from "../data/molecules";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

const elements = ["H","C","N","O","S","P","Cl","F"];

export default function BuildPanel({ selectedElement, onSelectElement, onClear }) {
  return (
    <div className="build-panel">
      <h3>Build Mode</h3>

      <div className="grid">
        {elements.map((el, i) => (
          <motion.button
            key={el}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelectElement(el)}
            className={selectedElement === el ? "active" : ""}
          >
            <div className="dot" style={{ background: elementColors[el] }} />
            <strong>{el}</strong>
            <small>{elementRadii[el]}Å</small>
          </motion.button>
        ))}
      </div>

      <div className="actions">
        <button><Plus size={16}/> Bond</button>
        <button onClick={onClear}><Trash2 size={16}/> Clear</button>
        <button><RotateCcw size={16}/> Undo</button>
      </div>
    </div>
  );
}
