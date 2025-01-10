import Input from "../ui/input";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../ui/button";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";

interface IProps {
  label: string;
  db_id: number;
}

const Dashboard = ({ label, db_id }: IProps) => {
  const [cacheData, setCacheData] = useState<any>(null);
  const [subUrl, setSubUrl] = useState("");
  const navigate = useNavigate();
  const [isEdittable, setIsEdittable] = useState(false);
  const [editedPayload, setEditedPayload] = useState("");

  const switchCacheDb = async () => {
    const userData = JSON.parse(
      localStorage.getItem("userData") || ("{}" as string)
    );

    if (!userData?.token) {
      navigate("/");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sessions/updatedb`,
        {},
        {
          params: { db_id: db_id },
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
    } catch (e) {
      console.log("somthing went wrong while switching db", e);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    switchCacheDb();
  }, [db_id]);

  const getCacheData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);

    if (!userData?.token) {
      navigate("/");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/sessions`,
        {
          params: { subscriber_url: subUrl },
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (Object.keys(response.data).length === 0) {
        setCacheData([]);
      } else {
        setCacheData([response.data]);
      }
    } catch (e) {
      toast.error("Error while fetching payloads");
      console.error("error while fetching payloads", e);
    }
  };

  const updateCachedata = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    let parsedPayload;

    try {
      parsedPayload = JSON.parse(editedPayload);
    } catch (e) {
      toast.erro("Invalid payload");
    }

    if (!userData?.token) {
      navigate("/");
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/sessions`,
        parsedPayload,
        {
          params: { subscriber_url: subUrl },
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      toast.success("Cache updated.");
    } catch (e) {
      toast.error("Error while fetching payloads");
      console.error("error while fetching payloads", e);
    }
  };

  const deleteCachedata = async () => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);

    if (!userData?.token) {
      navigate("/");
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/sessions`, {
        params: { subscriber_url: subUrl },
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      toast.success("Cache deleted.");
    } catch (e) {
      toast.error("Error while fetching payloads");
      console.error("error while fetching payloads", e);
    }
  };

  return (
    <div className="flex flex-col overflow-scroll">
      <div className="bg-white p-4">
        <h2 className="text-xl font-semibold">{label}</h2>
        {/* <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-400">Collection size: </p>
          <p className="text-sm text-gray-800">12</p>
        </div> */}
      </div>

      <div className="p-1 mt-4 flex flex-row gap-2">
        <Input
          placeholder="Subscriber Id"
          onChange={(data: string) => setSubUrl(data)}
        />
        <Button label="Send" onClick={() => getCacheData()} />
      </div>
      <div>
        <div className="p-2 flex flex-col gap-2">
          {!cacheData && (
            <p className="text-center">Search for cache using subscriber Id</p>
          )}
          {cacheData?.length === 0 && (
            <p className="text-center">No Records found</p>
          )}
          {cacheData?.length > 0 && <h2>Results</h2>}
          {cacheData?.length > 0 &&
            cacheData.map((item) => {
              return (
                <div className="h-72 flex flex-col relative">
                  <div
                    className={`absolute right-5 top-2 z-50 ${
                      isEdittable ? "bg-blue-200" : "bg-gray-200"
                    } p-2 rounded-md`}
                    onClick={() => {
                      setIsEdittable(!isEdittable);
                      setEditedPayload(JSON.stringify(item, null, 2));
                    }}
                  >
                    <MdEdit />
                  </div>
                  <Editor
                    defaultLanguage="json"
                    value={
                      isEdittable
                        ? editedPayload
                        : JSON.stringify(item, null, 2)
                    }
                    onChange={(data: string) => setEditedPayload(data)}
                    options={{
                      minimap: { enabled: false },
                      readOnly: !isEdittable,
                    }}
                  />
                  <div className="w-full flex justify-end gap-2 p-2">
                    <Button label="Delete" onClick={() => deleteCachedata()} />
                    <Button label="Update" onClick={() => updateCachedata()} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
