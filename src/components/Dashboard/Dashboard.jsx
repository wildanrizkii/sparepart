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
  Modal,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import Spreadsheet from "react-spreadsheet";
import ExcelJS from "exceljs";
import { supabase } from "@/app/utils/db";

const { Text } = Typography;

const Dashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraftVisible, setIsDraftVisible] = useState(true);

  const [visible, setVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [partName, setPartName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");

  const [dataDraft, setDataDraft] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [currentCartPage, setCurrentCartPage] = useState(1);
  const cartPageSize = 4;

  const router = useRouter();

  const handleCancel = () => {
    setVisible(false);
  };
  const handleOk = () => {
    setVisible(false);
  };

  const jsonData = [
    {
      "PART NO.": ": " + partNo,
      "PART NAME": ": " + partName,
      CUSTOMER: ": " + customerName,
      PROJECT: ": " + project,
      "REVISI / DATE": ": " + date,
    },
  ];

  const headers = [
    "PART NO.",
    "PART NAME",
    "CUSTOMER",
    "PROJECT",
    "REVISI / DATE",
  ];

  const spreadsheetData = headers.map((header) => [
    { value: header },
    { value: jsonData[0][header] || "" },
  ]);

  const [data, setData] = useState(spreadsheetData);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Menambahkan baris baru di awal dengan tulisan "PT. CIPTA MANDIRI WIRASAKTI" (hanya 1 baris)
    worksheet.insertRow(1, ["PT. CIPTA MANDIRI WIRASAKTI"]);
    worksheet.insertRow(2, ["SUPPLIER / MAKER LAY OUT"]); // Baris kosong ke-2

    // Menggabungkan sel untuk tulisan "PT. CIPTA MANDIRI WIRASAKTI"
    worksheet.mergeCells("A1:B1"); // Menggabungkan dari kolom A hingga B
    worksheet.mergeCells("A2:B2"); // Menggabungkan dari kolom A hingga B

    // Menggabungkan kolom H hingga K pada baris 1 dan 2
    worksheet.mergeCells("H1:K1");
    worksheet.mergeCells("H2:K2");

    // Mengatur gaya untuk tulisan "PT. CIPTA MANDIRI WIRASAKTI"
    const headerCell = worksheet.getCell("A1");
    headerCell.font = { bold: true, size: 14 };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

    const headerCell2 = worksheet.getCell("A2");
    headerCell2.font = { bold: true, size: 14 };
    headerCell2.alignment = { horizontal: "center", vertical: "middle" };

    // Menambahkan tulisan "SUPPLIER / MAKER LAY OUT" ke sel yang sudah digabungkan
    const supplierCell1 = worksheet.getCell("H1");
    supplierCell1.value = "SUPPLIER / MAKER LAY OUT";
    supplierCell1.font = { bold: true, size: 18 };
    supplierCell1.alignment = { horizontal: "center", vertical: "middle" };

    spreadsheetData.forEach((row, rowIndex) => {
      worksheet.getCell(`A${rowIndex + 4}`).value = row[0].value; // Baris dimulai dari 6 karena ada 4 baris tambahan di atas
      worksheet.getCell(`B${rowIndex + 4}`).value = row[1].value;

      // Styling
      worksheet.getCell(`A${rowIndex + 4}`).font = { bold: true };
      worksheet.getCell(`A${rowIndex + 4}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
      worksheet.getCell(`B${rowIndex + 4}`).alignment = {
        horizontal: "left",
        vertical: "middle",
      };
      worksheet.getCell(`A${rowIndex + 4}`).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      worksheet.getCell(`B${rowIndex + 4}`).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      // Highlight header
      if (rowIndex === 0) {
        worksheet.getCell(`A${rowIndex + 4}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" },
        };
        worksheet.getCell(`B${rowIndex + 4}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" },
        };
      }
    });

    worksheet.addRow([]);

    const draftColumnHeaders = worksheet.addRow([
      "FUNCTION",
      "PART NO INDUK",
      "Update Sub Part No based on Seppen",
      "PART NO ANAK",
      "Update Sub Part No based on Seppen",
      "PART NAME",
      "PART NO CMW",
      "DWG SUPPLIER",
      "MATERIAL",
      "IMPOR",
      "LOKAL",
      "PART NO",
      "MAKER",
      "REMARK",
    ]);
    draftColumnHeaders.font = { bold: true };

    worksheet.columns = [
      { width: 15 }, // PART NO INDUK
      { width: 25 }, // PART NO INDUK
      { width: 40 }, // Update Sub Part No
      { width: 30 }, // PART NAME
      { width: 40 }, // Update Sub Part No
      { width: 30 }, // PART NAME
      { width: 25 }, // PART NO CMW
      { width: 20 }, // DWG SUPPLIER
      { width: 35 }, // MATERIAL
      { width: 15 }, // IMPOR
      { width: 15 }, // LOKAL
      { width: 25 }, // PART NO
      { width: 15 }, // MAKER
      { width: 15 }, // REMARK
    ];

    draftColumnHeaders.height = 25;
    draftColumnHeaders.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ccffff" }, // Light blue color
      };
    });

    const usedNoPartInduk = new Set();

    dataDraft.forEach((draft) => {
      const noPartInduk = usedNoPartInduk.has(draft.no_part_induk)
        ? " "
        : draft.no_part_induk || "-";

      if (noPartInduk !== "-") {
        usedNoPartInduk.add(noPartInduk);
      }

      worksheet.addRow([
        "",
        noPartInduk,
        draft.no_part_induk_update || "-",
        draft.no_part || "-",
        draft.no_part_update || "-",
        draft.nama || "-",
        draft.no_cmw || "-",
        draft.nama_dwg || "-",
        draft.nama_material || "-",
        draft.nama_impor || "-",
        draft.nama_lokal || "-",
        draft.no_cmw || "-",
        draft.nama_maker || "-",
        "",
      ]);
    });

    // Style and formatting for draft section
    const lastRowIndex = worksheet.rowCount;
    for (let i = spreadsheetData.length + 3; i <= lastRowIndex; i++) {
      // Baris dimulai dari 3 karena ada 4 baris tambahan di atas
      const row = worksheet.getRow(i);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const now = new Date();
    const formattedDate = now
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ""); // Format: DDMMYYYY

    const formattedTime = now
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/:/g, ""); // Format: HHMMSS

    const fileName = `laporan-${formattedDate}-${formattedTime}.xlsx`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchPartInduk = async () => {
    try {
      const { data, error } = await supabase.from("part_induk").select("*");
      const partindukData = data.map((row, index) => ({
        key: row.id_pi,
        nomor_pi: row.no_part,
        nomor_pi_update: row.no_part_update,
      }));
      setInitialData(partindukData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaporan = async () => {
    console.log("Customer Name:", customerName);
    console.log("Part Name:", partName);
    console.log("Part No.:", partNo);
    console.log("Project:", project);
    console.log("Date:", date);

    try {
      exportToExcel();
    } catch (error) {
      console.error("Error generate laporan: ", error);
    }
  };

  const fetchDataDraft = async () => {
    try {
      const { data, error } = await supabase
        .from("view_part_details")
        .select("*");
      setDataDraft(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataDraft();
  }, []);

  const fetchDraftLaporan = async () => {
    try {
      const { data, error } = await supabase.from("draft").select("*");
      setCartItems(data);

      const selectedKeys = data
        .map((item) => {
          const matchingRow = initialData.find(
            (row) => row.nomor_pi === item.no_part
          );
          return matchingRow ? matchingRow.key : null;
        })
        .filter((key) => key !== null);

      setSelectedRowKeys(selectedKeys);
    } catch (error) {
      console.error("Error fetching draft laporan:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialData.length > 0) {
      fetchDraftLaporan();
    }
  }, [initialData]);

  const handleRowClick = async (event, record) => {
    let paramsData = "";
    try {
      const { data, error } = await supabase
        .from("part_induk")
        .select("*")
        .eq("id_pi", record.key);

      paramsData = data[0].no_part;
    } catch (error) {
      console.error("Error fetching data: ", error);
    }

    const isCheckbox =
      event.target.tagName === "INPUT" && event.target.type === "checkbox";
    const isCheckboxCell = event.target.className.includes(
      "ant-table-cell-with-append"
    );

    if (!isCheckbox && !isCheckboxCell) {
      router.push(`/detail/${paramsData}`);
    }
  };

  const onSelectChange = async (newSelectedRowKeys, selectedRows) => {
    try {
      const newlySelectedRows = selectedRows.filter(
        (row) => !selectedRowKeys.includes(row.key)
      );

      const unselectedKeys = selectedRowKeys.filter(
        (key) => !newSelectedRowKeys.includes(key)
      );

      for (const row of newlySelectedRows) {
        const { data, error } = await supabase
          .from("draft")
          .select("*")
          .eq("no_part", row.nomor_pi);

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Insert successful:", data);
        }

        if (data.length > 0) {
          console.log("Data sudah ada pada draft!");
        } else {
          const { data, error } = await supabase.from("draft").insert([
            {
              id_pi: row.key,
              no_part: row.nomor_pi,
              no_part_update: row.nomor_pi_update,
            },
          ]);
          if (error) {
            console.error("Error inserting data:", error);
          } else {
            console.log("Insert successful:", data);
          }
        }
      }

      for (const key of unselectedKeys) {
        const rowToDelete = initialData.find((row) => row.key === key);
        if (rowToDelete) {
          const draftItem = cartItems?.find(
            (item) => item.no_part === rowToDelete.nomor_pi
          );
          if (draftItem) {
            const { data, error } = await supabase
              .from("draft")
              .delete()
              .eq("id_draft", draftItem.id_draft);

            if (error) {
              console.error("Error deleting data:", error);
            } else {
              console.log(
                `Data with id_draft ${draftItem.id_draft} deleted successfully:`,
                data
              );
            }
          }
        }
      }

      setSelectedRowKeys(newSelectedRowKeys);

      await fetchDraftLaporan();
      await fetchDataDraft();
    } catch (error) {
      console.error("Error updating draft laporan:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const columns = [
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nomorPi = (item.nomor_pi || "-").toString();
      const nomorPiUpdate = (item.nomor_pi_update || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPi.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPiUpdate.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(initialData);
    fetchPartInduk();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const removeFromCart = async (itemKey) => {
    try {
      const { data, error } = await supabase
        .from("draft")
        .delete()
        .eq("id_draft", itemKey);

      if (error) {
        console.error("Error deleting data:", error);
      } else {
        const removedItem = cartItems?.find(
          (item) => item.id_draft === itemKey
        );
        const matchingRow = initialData.find(
          (row) => row.nomor_pi === removedItem.no_part
        );

        if (matchingRow) {
          setSelectedRowKeys((prev) =>
            prev.filter((key) => key !== matchingRow.key)
          );
        }

        await fetchDraftLaporan();

        const totalPages = Math.ceil((cartItems?.length - 1) / cartPageSize);
        if (currentCartPage > totalPages && totalPages > 0) {
          setCurrentCartPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const { data, error } = await supabase
        .from("draft")
        .delete()
        .neq("id_draft", 0);

      if (error) {
        console.error("Error deleting all data:", error);
      } else {
        setCartItems([]);
        setSelectedRowKeys([]);
        setCurrentCartPage(1);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getPaginatedCartItems = () => {
    const startIndex = (currentCartPage - 1) * cartPageSize;
    return cartItems?.slice(startIndex, startIndex + cartPageSize);
  };

  const onCartPageChange = (page) => {
    setCurrentCartPage(page);
  };

  const toggleDraftVisibility = () => {
    setIsDraftVisible(!isDraftVisible);
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
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="space-y-4">
        {/* Header Section */}
        <Flex justify="space-between" align="center">
          <div className="text-2xl font-medium">
            <p>Daftar Part Induk</p>
          </div>
          <Badge count={cartItems?.length}>
            <FileDoneOutlined
              style={{ fontSize: "24px" }}
              onClick={toggleDraftVisibility}
              className="cursor-pointer"
            />
          </Badge>
        </Flex>

        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
            className="w-full"
          />
        </div>

        {/* Flex Container untuk Table dan Draft Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Draft Section */}
          {isDraftVisible && (
            <div className="w-full lg:w-1/3">
              <Card
                title={
                  <div className="flex justify-between items-center">
                    <Text>Draft Laporan ({cartItems?.length})</Text>
                    {cartItems?.length > 0 && (
                      <Button type="text" danger onClick={clearCart}>
                        Clear All
                      </Button>
                    )}
                  </div>
                }
                className="h-[607px] shadow-sm"
              >
                <List
                  dataSource={getPaginatedCartItems()}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.id_draft)}
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          item.no_part ? (
                            <div className="grid">
                              <div>No Part</div>
                              <div className="font-bold text-nowrap">
                                {item.no_part}
                              </div>
                            </div>
                          ) : (
                            <div className="grid">
                              <div>No Part Update</div>
                              <div className="font-bold">-</div>
                            </div>
                          )
                        }
                        description={
                          item.no_part_update ? (
                            <div className="grid">
                              <div>No Part Update</div>
                              <div className="font-bold text-nowrap">
                                {item.no_part_update}
                              </div>
                            </div>
                          ) : (
                            <div className="grid">
                              <div>No Part Update</div>
                              <div className="font-bold">-</div>
                            </div>
                          )
                        }
                      />
                    </List.Item>
                  )}
                  locale={{
                    emptyText: "Pilih part yang akan dijadikan laporan",
                  }}
                  loading={loading}
                />

                <Modal
                  title={
                    <div className="text-center text-xl font-semibold text-gray-700">
                      Generate Report
                    </div>
                  }
                  open={visible}
                  closeIcon={true}
                  onCancel={handleCancel}
                  footer={null}
                  centered
                >
                  <div className="space-y-4 p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Part No.
                      </label>
                      <Input
                        placeholder="Enter part number"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="w-full rounded-md h-10"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Part Name
                      </label>
                      <Input
                        placeholder="Enter part name"
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        className="w-full rounded-md h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name
                      </label>
                      <Input
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-md h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <Input
                        placeholder="Enter project name"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="w-full rounded-md h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Revisi / Date
                      </label>
                      <Input
                        placeholder="Enter date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-md h-10"
                      />
                    </div>
                    <Button
                      className="w-full h-12 mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                      onClick={handleLaporan}
                    >
                      Download to Excel
                    </Button>
                  </div>
                </Modal>
              </Card>

              {cartItems?.length > cartPageSize && (
                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={currentCartPage}
                    total={cartItems?.length}
                    pageSize={cartPageSize}
                    onChange={onCartPageChange}
                    size="large"
                  />
                </div>
              )}

              {cartItems?.length > 0 && (
                <Button
                  className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setVisible(true)}
                >
                  Generate excel
                </Button>
              )}

              {/* Pagination */}
            </div>
          )}

          <div className={`w-full ${isDraftVisible ? "lg:w-2/3" : ""}`}>
            <Flex gap="middle" vertical>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  position: ["bottomRight"],
                  responsive: true,
                }}
                size="large"
                bordered={true}
                onRow={(record) => ({
                  onClick: (e) => handleRowClick(e, record),
                  style: { cursor: "pointer" },
                })}
                loading={loading}
              />
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
