import { api } from "@/utils/api";
import { type Fasilitas } from "@prisma/client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface FacilityProps {
  value: string[];
  onChange: (value: string[]) => void;
  fasilitas?: Fasilitas[];
}

const Facility: React.FC<FacilityProps> = ({ value, onChange, fasilitas }) => {
  const [fasilias, setFasilias] = useState(fasilitas);

  const { mutate } = api.listings.deleteFasilitas.useMutation({
    onSuccess: (e) => {
      toast.success("Fasilitas deleted");
      setFasilias(e.fasilitas);
    },
  });
  const [todos, setTodos] = useState(value); // State untuk menyimpan daftar todos
  const [newTodo, setNewTodo] = useState(""); // State untuk nilai baru yang akan ditambahkan

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value); // Memperbarui nilai state newTodo saat input berubah
  };

  const handleAddTodo = () => {
    // Menambahkan nilai baru ke dalam array todos
    if (newTodo.trim() !== "") {
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      onChange(updatedTodos);
      setNewTodo(""); // Mengosongkan nilai input setelah ditambahkan
    }
  };

  const handleDeleteTodo = (index: number) => {
    // Menghapus todo berdasarkan index
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    onChange(updatedTodos);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Mencegah aksi default saat menekan tombol "Enter"
      handleAddTodo(); // Menambahkan todo saat tombol "Enter" ditekan
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          className="w-full rounded-md border border-gray-300 px-2 py-1 focus:border-rose-500 focus:outline-none"
          placeholder="Tambakan fasilitas"
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="rounded-md bg-rose-500 px-2 py-1 font-bold text-white hover:bg-rose-600 focus:outline-none"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>

      <ul className="list-inside list-disc">
        {todos.map((todo, index) => (
          <li key={index} className="mb-2 flex items-center justify-between">
            <span>{todo}</span>
            <button
              className="ml-2 rounded-md bg-rose-500 px-2 py-1 font-bold text-white hover:bg-rose-600 focus:outline-none"
              onClick={() => handleDeleteTodo(index)}
            >
              Delet
            </button>
          </li>
        ))}
        {fasilias?.map((item) => {
          const deletedFasilitas = () => {
            mutate({
              id: item.id,
              listingId: item.listingId,
            });
          };
          return (
            <li
              key={item.id}
              className="mb-2 flex items-center justify-between"
            >
              <span>{item.fasilitas}</span>
              <button
                className="ml-2 rounded-md bg-rose-500 px-2 py-1 font-bold text-white hover:bg-rose-600 focus:outline-none"
                onClick={deletedFasilitas}
              >
                Delet
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Facility;
