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
  const [allSession, setAllSession] = useState([]);

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
      getAllSession();
    } catch (e) {
      console.log("somthing went wrong while switching db", e);
      toast.error("Something went wrong");
    }
  };

  const getAllSession = async () => {
    const userData = JSON.parse(
      localStorage.getItem("userData") || ("{}" as string)
    );

    if (!userData?.token) {
      navigate("/");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/sessions/all`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      console.log("Response data", response.data);
      setAllSession(response.data);
    } catch (e) {
      console.log("somthing went wrong while fetching all  session", e);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    setCacheData(null);
    switchCacheDb();
  }, [db_id]);

  const getCacheData = async (key: string) => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);

    if (!userData?.token) {
      navigate("/");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/sessions`,
        {
          params: { subscriber_url: key },
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
      toast.error("Invalid payload");
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
        <Button label="Send" onClick={() => getCacheData(subUrl)} />
      </div>
      <div>
        {!cacheData ? (
          <div>
            <h2>Results</h2>
            {allSession?.map((session: any) => {
              return (
                <div
                  className="border-b last:border-none px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => {
                    setSubUrl(session);
                    getCacheData(session);
                  }}
                >
                  <span className="text-gray-700">{session}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-2">
            {!cacheData && (
              <p className="text-center">
                Search for cache using subscriber Id
              </p>
            )}
            {cacheData?.length === 0 && (
              <p className="text-center">No Records found</p>
            )}
            {cacheData?.length > 0 && <h2>Results</h2>}
            {cacheData?.length > 0 &&
              cacheData.map((item: any) => {
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
                      onChange={(data: any) => setEditedPayload(data)}
                      options={{
                        minimap: { enabled: false },
                        readOnly: !isEdittable,
                      }}
                    />
                    <div className="w-full flex justify-end gap-2 p-2">
                      <Button
                        label="Delete"
                        onClick={() => deleteCachedata()}
                      />
                      <Button
                        label="Update"
                        onClick={() => updateCachedata()}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
