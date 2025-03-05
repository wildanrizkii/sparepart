"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Flex,
  Table,
  Card,
  List,
  Typography,
  Badge,
  Pagination,
  Descriptions,
  Modal,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/navigation";
import supabase from "@/app/utils/db";

const { Text } = Typography;

const DetailPartInduk = ({ nomor }) => {
  const [searchText, setSearchText] = useState("");
  const [partId, setPartId] = useState("");
  const [noPart, setNoPart] = useState("");
  const [noPartUpdate, setNoPartUpdate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusButton, setStatusButton] = useState(false);

  const [initialData, setInitialData] = useState([]);

  // Cart pagination states
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 7; // Items per page in cart

  const router = useRouter();

  function replacePercent(nomor) {
    return nomor.replace(/%20/g, " ");
  }

  console.log(replacePercent(nomor));

  const fetchPartInduk = async () => {
    try {
      const { data, error } = await supabase
        .from("part_induk")
        .select("*")
        .eq("no_part", replacePercent(nomor));

      const dataLength = data.length;

      // if (dataLength === 0) {
      //   router.push("/");
      // } else {
      //   setPartId(data[0].id_pi);
      //   setNoPart(data[0].no_part);
      //   setNoPartUpdate(data[0].no_part_update);
      // }

      setPartId(data[0]?.id_pi);
      setNoPart(data[0]?.no_part);
      setNoPartUpdate(data[0]?.no_part_update);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartAnak = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("view_part_gabungan")
        .select(
          `
        id_gabungan,
        id_pa,
        id_pi,
        nama,
        no_part,
        no_part_update,
        no_cmw,
        nama_dwg,
        nama_material,
        nama_lokal,
        nama_maker,
        nama_impor
      `
        )
        .eq("id_pi", partId);

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      const { data: response2, error: errorJumlah } = await supabase
        .from("draft")
        .select("id_pi")
        .eq("id_pi", partId);

      if (errorJumlah) {
        console.error("Error fetching data:", error);
      }

      setTimeout(() => {
        setLoadingButton(false);

        if (response2.length == 1) {
          setStatusButton(true);
        } else {
          setStatusButton(false);
        }
      }, 1000);

      const partAnakData = response.map((row) => ({
        key: row.id_pa,
        nomor_pa: row.no_part || "-",
        nomor_pa_update: row.no_part_update || "-",
        supplier: (() => {
          const lokal = row.nama_lokal ? `${row.nama_lokal} (lokal)` : "";
          const impor = row.nama_impor ? `${row.nama_impor} (impor)` : "";
          return [lokal, impor].filter(Boolean).join(", ") || "-";
        })(),
        maker: row.nama_maker || "-",
        part_name: row.nama || "",
        no_cmw: row.no_cmw,
        dwg: row.nama_dwg,
        material: row.nama_material,
      }));
      setInitialData(partAnakData || []);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setInitialData([]); // Ensure array even on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartInduk();
  }, [nomor]); // Add dependency to prevent infinite loop

  useEffect(() => {
    if (partId) {
      fetchPartAnak();
    }
  }, [partId]); // Only run when partId changes

  const handleRowClick = (record) => {
    // console.log("Selected Record:", record);
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const columns = [
    // {
    //   title: "No.",
    //   dataIndex: "no",
    //   width: 10,
    // },
    {
      title: "No Part Anak",
      dataIndex: "nomor_pa",
    },
    {
      title: "No CMW",
      dataIndex: "no_cmw",
    },
    {
      title: "Part Name",
      dataIndex: "part_name",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
    },
    {
      title: "Maker",
      dataIndex: "maker",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nomorPi = (item.nomor_pa || "-").toString();
      const nomorPiUpdate = (item.nomor_pa_update || "-").toString();
      const noCMW = (item.no_cmw || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPi.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPiUpdate.toLowerCase().includes(searchValue.toLowerCase()) ||
        noCMW.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  const handleTambah = async (id_pi, value1, value2) => {
    try {
      const { data, error } = await supabase.from("draft").insert([
        {
          id_pi: id_pi,
          no_part: value1,
          no_part_update: value2,
        },
      ]);

      if (error) {
        setStatusButton(false);
      } else {
        setLoadingButton(true); // Set loading to true
        setTimeout(() => {
          setLoadingButton(false);
          setStatusButton(true);
        }, 800);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleHapus = async (value) => {
    try {
      const { data, error } = await supabase
        .from("draft")
        .delete()
        .eq("no_part", value);

      if (error) {
        setStatusButton(true);
      } else {
        setLoadingButton(true); // Set loading to true
        setTimeout(() => {
          setLoadingButton(false);
          setStatusButton(false);
        }, 800);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Initialize filtered data
  useEffect(() => {
    setFilteredData(initialData);
  }, []); // Effect untuk fetch data awal

  // Tambahkan effect baru untuk update filteredData
  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  // Handle row selection with improved uncheck handling
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    const uncheckedKeys = selectedRowKeys.filter(
      (key) => !newSelectedRowKeys.includes(key)
    );

    setSelectedRowKeys(newSelectedRowKeys);

    if (uncheckedKeys.length > 0) {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => !uncheckedKeys.includes(item.key))
      );
    }

    const newItems = selectedRows.filter(
      (row) => !cartItems.some((cartItem) => cartItem.key === row.key)
    );

    if (newItems.length > 0) {
      setCartItems((prevCartItems) => [...prevCartItems, ...newItems]);
      // Reset to first page when new items are added
      setCurrentCartPage(1);
    }
  };

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  return (
    <div className="max-w-screen-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-medium">
            <p>Informasi Part Induk</p>
          </div>
          <button
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
            onClick={() => router.back()} // Pastikan router diimpor jika menggunakan Next.js
          >
            Kembali
          </button>
        </div>

        <div>
          <Input
            placeholder="Cari No. Part Anak atau No. CMW"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
            // className="shadow-md"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-2 p-4 bg-white rounded-md border border-gray-200 items-center">
          <div className="grid">
            <div className="text-sm text-gray-500">Nomor Part Induk</div>
            <div className="font-bold text-lg text-gray-800">
              {noPart || "-"}
            </div>
          </div>

          <div className="grid">
            <div className="text-sm text-gray-500">Nomor Part Induk Update</div>
            <div className="font-bold text-lg text-gray-800">
              {noPartUpdate || "-"}
            </div>
          </div>

          <div className="w-full sm:w-auto sm:ml-auto">
            {loadingButton ? (
              <Button
                loading
                className="w-full sm:w-auto px-4 py-2 min-h-[42px] text-white bg-gray-200 hover:bg-gray-200 rounded-md shadow-md flex items-center justify-center"
                disabled
              >
                Loading...
              </Button>
            ) : statusButton ? (
              <Button
                className="w-full sm:w-auto px-4 py-2 min-h-[42px] text-white bg-red-600 hover:bg-red-700 rounded-md shadow-md flex items-center justify-center"
                onClick={() => handleHapus(noPart)}
              >
                - Hapus dari draft
              </Button>
            ) : (
              <Button
                className="w-full sm:w-auto px-4 py-2 min-h-[42px] text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md flex items-center justify-center"
                onClick={() => handleTambah(partId, noPart, noPartUpdate)}
              >
                + Tambahkan ke draft
              </Button>
            )}
          </div>
        </div>

        {/* Table Section */}

        <Flex gap="middle" vertical>
          {/* <Flex align="center" gap="middle">
                <Button
                  type="primary"
                  onClick={start}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Export selected data
                </Button>
                {hasSelected
                  ? `Selected ${selectedRowKeys.length} items`
                  : null}
              </Flex> */}
          <Table
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            pagination={{
              position: ["bottomRight"],
              responsive: true,
            }}
            size="large"
            bordered={true}
            onRow={(record) => ({
              onClick: (e) => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </Flex>
        <Modal
          title="Detail Part Anak"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={600}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedRow && (
            <Descriptions
              layout="vertical"
              bordered
              column={{ xs: 1, sm: 2, md: 2 }}
              style={{
                marginTop: "20px",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Descriptions.Item label="No Part Anak" span={3}>
                <strong>{selectedRow.nomor_pa || "-"}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="No Part Anak Update" span={3}>
                <strong>{selectedRow.nomor_pa_update || "-"}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Part Name" span={3}>
                {selectedRow.part_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="No CMW" span={3}>
                {selectedRow.no_cmw || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="DWG Supplier" span={3}>
                {selectedRow.dwg || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Maker" span={3}>
                {selectedRow.maker || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Supplier" span={3}>
                {selectedRow.supplier || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Material" span={3}>
                {selectedRow.material || "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DetailPartInduk;
