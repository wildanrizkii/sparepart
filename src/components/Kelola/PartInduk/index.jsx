"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/app/utils/db";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Avatar,
  Card,
  Badge,
  Flex,
  Switch,
  Button,
  Progress,
  Col,
  DatePicker,
  Popconfirm,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Divider,
  List,
  Spin,
  Empty,
  Result,
  Table,
  notification,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

const PartInduk = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [idPartInduk, setIdPartInduk] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [partAnakData, setPartAnakData] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [daftarIdPartAnak, setDaftarIdPartAnak] = useState([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [searchTextPartAnak, setSearchTextpartAnak] = useState("");
  const [selectedRowKeysEdit, setSelectedRowKeysEdit] = useState([]);
  const [filteredPartAnakData, setFilteredPartAnakData] = useState([]);
  const [temporarySelectedRows, setTemporarySelectedRows] = useState([]);
  const [searchTextPartAnakEdit, setSearchTextpartAnakEdit] = useState("");

  const router = useRouter();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const onClose = () => {
    setOpen(false);
    hideEditDrawer();
  };

  const hideEditDrawer = () => {
    setEditDrawerOpen(false);
    editForm.resetFields();
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      width: 54,
      align: "center",
    },
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "Edit",
      width: 128,
      align: "center",
      render: (_, record) => (
        <div className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
          <button
            className="inline-block border-e p-3 text-gray-700 hover:bg-emerald-200 focus:relative transition-colors"
            title="Ubah part induk"
            onClick={(e) => {
              e.stopPropagation();
              showEditDrawer(record);
            }}
          >
            <EditOutlined />
          </button>

          <Popconfirm
            placement="bottomRight"
            cancelText="Batal"
            okText="Hapus"
            title="Konfirmasi"
            description="Anda yakin ingin menghapus part induk ini?"
            onConfirm={(e) => {
              handleDeletePartInduk(record.key);
              e.stopPropagation();
            }}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
          >
            <button
              className="inline-block p-3 text-gray-700 hover:bg-red-200 focus:relative transition-colors"
              title="Hapus part induk"
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const columnsPartAnak = [
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
      dataIndex: "nama",
    },
    {
      title: "Maker",
      dataIndex: "maker",
    },
  ];

  const showEditDrawer = async (values) => {
    // console.log(values.key);
    setIdPartInduk(values.key);
    setEditDrawerOpen(true);

    const { data, error } = await supabase
      .from("part_gabungan")
      .select("*")
      .eq("id_pi", values.key);

    const selectedKeys = data
      .map((item) => {
        const matchingRow = partAnakData.find((row) => row.key == item.id_pa);
        return matchingRow ? matchingRow.key : null;
      })
      .filter((key) => key !== null);

    // console.log(selectedKeys);

    setDaftarIdPartAnak(selectedKeys);

    editForm.setFieldsValue({
      id_pi: values.key ?? null,
      nopartinduk: values.nomor_pi ?? null,
      nopartindukupdate: values.nomor_pi_update ?? null,
    });
  };

  const onSelectChangeEdit = async (newSelectedRowKeys, selectedRows) => {
    try {
      const newlySelectedRows = selectedRows.filter(
        (row) => !selectedRowKeys.includes(row.key)
      );

      const unselectedKeys = selectedRowKeys.filter(
        (key) => !newSelectedRowKeys.includes(key)
      );

      // console.log(newSelectedRowKeys);
      // console.log(selectedRows);
      // console.log(newlySelectedRows);
      console.log(unselectedKeys);

      setDaftarIdPartAnak(newSelectedRowKeys);
    } catch (error) {
      console.error("Error updating draft laporan:", error);
    }
  };

  const onSelectChange = async (newSelectedRowKeys, selectedRows) => {
    try {
      // Menyaring item yang baru saja dipilih
      const newlySelectedRows = selectedRows.filter(
        (row) => !selectedRowKeys.includes(row.key)
      );

      // Menyaring item yang tidak dipilih
      const unselectedKeys = selectedRowKeys.filter(
        (key) => !newSelectedRowKeys.includes(key)
      );

      // Menambahkan item yang baru dipilih ke dalam state sementara
      setTemporarySelectedRows((prevSelectedRows) => [
        ...prevSelectedRows,
        ...newlySelectedRows,
      ]);

      // Menghapus item yang tidak dipilih dari state sementara
      setTemporarySelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((row) => !unselectedKeys.includes(row.key))
      );

      // Update state selectedRowKeys dengan yang baru
      setSelectedRowKeys(newSelectedRowKeys);
    } catch (error) {
      console.error("Error updating selected rows:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const rowSelectionEdit = {
    selectedRowKeys: daftarIdPartAnak,
    onChange: onSelectChangeEdit,
    preserveSelectedRowKeys: true,
  };

  const fetchPartInduk = async () => {
    try {
      let allData = [];
      let from = 0;
      let to = 999;

      while (true) {
        const { data, error } = await supabase
          .from("part_induk")
          .select("*")
          .range(from, to); // Ambil data dalam batch

        if (error) {
          console.error("Error fetching data:", error);
          break;
        }

        if (data.length === 0) break; // Jika tidak ada data lagi, berhenti

        allData = [...allData, ...data]; // Gabungkan data ke dalam array utama

        from += 1000;
        to += 1000;
      }

      const partindukData = allData?.map((row, index) => ({
        key: row.id_pi,
        no: index + 1 + ".",
        nomor_pi: row.no_part ?? "-",
        nomor_pi_update: row.no_part_update ?? "-",
      }));

      setInitialData(partindukData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setInitialData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartAnak = async () => {
    try {
      let allData = [];
      let from = 0;
      let to = 999;

      while (true) {
        const { data, error } = await supabase
          .from("view_part_anak_detail")
          .select("*")
          .range(from, to);

        if (error) {
          console.error("Error fetching data:", error);
          break;
        }

        if (data.length === 0) break;

        allData = [...allData, ...data];

        from += 1000;
        to += 1000;
      }

      const partanakData = allData.map((row, index) => ({
        key: row.id_pa,
        no: index + 1 + ".",
        nomor_pa: row.no_part ?? "-",
        nama: row.nama ?? "-",
        no_cmw: row.no_cmw ?? "-",
        maker: row.nama_maker ?? "-",
      }));

      setPartAnakData(partanakData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPartAnakData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPartAnak = (value) => {
    setSearchTextpartAnak(value);

    if (!value) {
      setFilteredPartAnakData(partAnakData);
      return;
    }

    const filtered = partAnakData.filter((item) => {
      const nomorPa = (item.nomor_pa || "-").toString();
      const noCMW = (item.no_cmw || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPa.toLowerCase().includes(searchValue.toLowerCase()) ||
        noCMW.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredPartAnakData(filtered);
  };

  const handleSearchPartAnakEdit = (value) => {
    setSearchTextpartAnakEdit(value);

    if (!value) {
      setFilteredPartAnakData(partAnakData);
      return;
    }

    const filtered = partAnakData.filter((item) => {
      const nomorPa = (item.nomor_pa || "-").toString();
      const noCMW = (item.no_cmw || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPa.toLowerCase().includes(searchValue.toLowerCase()) ||
        noCMW.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredPartAnakData(filtered);
  };

  const handleDeletePartInduk = async (values) => {
    try {
      const { data, error } = await supabase
        .from("part_induk")
        .delete()
        .eq("id_pi", values);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menghapus part induk",
          placement: "top",
          duration: 3,
        });

        fetchPartInduk();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part induk berhasil dihapus",
          placement: "top",
          duration: 5,
        });

        fetchPartInduk();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menghapus part induk",
        placement: "top",
        duration: 3,
      });

      fetchPartInduk();
    }
  };

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
    setFilteredPartAnakData(partAnakData);
    fetchPartInduk();
    fetchPartAnak();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  useEffect(() => {
    setFilteredPartAnakData(partAnakData);
  }, [partAnakData]);

  const handleSubmit = async (values) => {
    try {
      const { data, error } = await supabase
        .from("part_induk")
        .insert([
          {
            id_pi: await supabase
              .from("part_induk")
              .select("id_pi", { count: "exact", head: true })
              .then((r) => r.count + 1),
            no_part: values.nopartinduk,
            no_part_update: values.nopartindukupdate,
          },
        ])
        .select("id_pi");

      const id_pi = data[0]?.id_pi;
      onClose();
      form.resetFields();

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menambah part induk",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part induk baru berhasil ditambahkan",
          placement: "top",
          duration: 5,
        });
      }

      // console.log("Selected Rows:", temporarySelectedRows);

      const mappedRows = temporarySelectedRows.map((row) => ({
        id_pa: row.key,
        id_pi: id_pi,
      }));

      const { data: response, error: error2 } = await supabase
        .from("part_gabungan")
        .insert(mappedRows); // Tanpa id_gabungan

      if (error2) {
        console.error("Error inserting data into part_gabungan:", error2);
      }
    } catch (error) {
      console.error("Error on submit data!");
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah part induk",
        placement: "top",
        duration: 3,
      });
    } finally {
      router.refresh();
    }
  };

  const handleEdit = async (values) => {
    try {
      const { data, error } = await supabase
        .from("part_induk")
        .update({
          no_part: values.nopartinduk === "-" ? null : values.nopartanak,
          no_part_update:
            values.nopartindukupdate === "-" ? null : values.nopartindukupdate,
        })
        .eq("id_pi", values.key);

      if (error) {
        console.error("Error updating data:", error);
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat mengubah part induk",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part induk berhasil diperbarui",
          placement: "top",
          duration: 5,
        });
        fetchPartInduk();
      }
    } catch (error) {
      console.error("Error on edit data!", error);
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat mengubah part induk",
        placement: "top",
        duration: 3,
      });
    } finally {
      hideEditDrawer();
      router.refresh();
    }
  };

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <Drawer
          width={960}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Tambah Part Induk</p>}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Space>
                <button
                  type="button"
                  onClick={onClose}
                  className="max-w-44 text-wrap rounded border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => form.submit()}
                  type="button"
                  className="min-w-36 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Simpan
                </button>
              </Space>
            </div>
          }
        >
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartinduk"
                  label="Nomor Part Induk"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartinduk"
                    placeholder="Masukkan nomor part induk"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartindukupdate"
                  label="Nomor Part Induk Update"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartindukupdate"
                    placeholder="Masukkan nomor part induk update"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    // required
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="partanak"
                  label="Pilih Part Anak"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Flex gap="middle" vertical>
                    <Input
                      placeholder="Cari Nomor Part Anak atau No CMW"
                      size="large"
                      value={searchTextPartAnak}
                      onChange={(e) => handleSearchPartAnak(e.target.value)}
                      suffix={suffix}
                    />
                    <Table
                      rowSelection={rowSelection}
                      columns={columnsPartAnak}
                      dataSource={filteredPartAnakData}
                      pagination={{
                        position: ["bottomRight"],
                        responsive: true,
                      }}
                      size="large"
                      bordered={true}
                      // onRow={(record) => ({
                      //   onClick: (e) => handleRowClick(e, record),
                      //   style: { cursor: "pointer" },
                      // })}
                      // loading={loading}
                    />
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>

        <Drawer
          width={720}
          onClose={onClose}
          open={editDrawerOpen}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Edit Part Anak</p>}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Space>
                <button
                  type="button"
                  onClick={onClose}
                  className="max-w-44 text-wrap rounded border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => editForm.submit()}
                  type="button"
                  className="min-w-36 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Simpan
                </button>
              </Space>
            </div>
          }
        >
          <Form layout="vertical" onFinish={handleEdit} form={editForm}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartinduk"
                  label="No Part Induk"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartinduk"
                    placeholder="Masukkan no part induk"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartindukupdate"
                  label="No Part Induk Update"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartindukupdate"
                    placeholder="Masukkan no part induk update"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="tablepartanak"
                  label="Pilih Part Anak"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Flex gap="middle" vertical>
                    <Input
                      placeholder="Cari Nomor Part Anak atau No CMW"
                      size="large"
                      value={searchTextPartAnakEdit}
                      onChange={(e) => handleSearchPartAnakEdit(e.target.value)}
                      suffix={suffix}
                    />
                    <Table
                      rowSelection={rowSelectionEdit}
                      columns={columnsPartAnak}
                      dataSource={filteredPartAnakData}
                      pagination={{
                        position: ["bottomRight"],
                        responsive: true,
                      }}
                      size="large"
                      bordered={true}
                      // onRow={(record) => ({
                      //   onClick: (e) => handleRowClick(e, record),
                      //   style: { cursor: "pointer" },
                      // })}
                      // loading={loading}
                    />
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium col-span-1">Kelola Part Induk</h1>
          <div className="grid gap-4">
            <button
              onClick={showDrawer}
              type="submit"
              className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
            >
              Tambah Part Induk
            </button>
          </div>
        </div>

        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
        </div>
        <Flex gap="middle" vertical>
          <Table
            //   rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            pagination={{
              position: ["bottomRight"],
              responsive: true,
            }}
            size="large"
            bordered={true}
            //   onRow={(record) => ({
            //     onClick: (e) => handleRowClick(e, record),
            //     style: { cursor: "pointer" },
            //   })}
            loading={loading}
          />
        </Flex>
      </div>
    </div>
  );
};

export default PartInduk;
