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

const Supplier = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const router = useRouter();
  const [form] = useForm();
  const [editForm] = Form.useForm();

  const onClose = () => {
    setOpen(false);
    hideEditDrawer();
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const showEditDrawer = (values) => {
    setIdSupplier(values.key);
    setEditDrawerOpen(true);

    editForm.setFieldsValue({
      id_dwg: values.key,
      namasupplier: values.nama,
    });
  };

  const hideEditDrawer = () => {
    setEditDrawerOpen(false);
    editForm.resetFields();
  };

  const handleEdit = async (values) => {
    try {
      const { data, error } = await supabase
        .from("dwg_supplier")
        .update({ nama: values.namasupplier })
        .eq("id_dwg", idSupplier);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat mengubah supplier",
          placement: "top",
          duration: 3,
        });
        hideEditDrawer();
        fetchSupplier();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Supplier berhasil diubah",
          placement: "top",
          duration: 5,
        });
        hideEditDrawer();
        fetchSupplier();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat mengubah supplier",
        placement: "top",
        duration: 3,
      });
      hideEditDrawer();
      fetchSupplier();
    }
  };

  const handleDeleteSupplier = async (values) => {
    try {
      const { data, error } = await supabase
        .from("dwg_supplier")
        .delete()
        .eq("id_dwg", values);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menghapus supplier",
          placement: "top",
          duration: 3,
        });

        fetchSupplier();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Supplier berhasil dihapus",
          placement: "top",
          duration: 5,
        });

        fetchSupplier();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menghapus supplier",
        placement: "top",
        duration: 3,
      });

      fetchSupplier();
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

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      width: 54,
      align: "center",
    },
    {
      title: "Nama Supplier",
      dataIndex: "nama",
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
            title="Ubah supplier"
            onClick={() => showEditDrawer(record)}
          >
            <EditOutlined />
          </button>

          <Popconfirm
            placement="bottomRight"
            cancelText="Batal"
            okText="Hapus"
            title="Konfirmasi"
            description="Anda yakin ingin menghapus supplier ini?"
            onConfirm={() => handleDeleteSupplier(record.key)}
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
              title="Hapus supplier"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchSupplier = async () => {
    try {
      const { data, error } = await supabase.from("dwg_supplier").select("*");
      const supplierData = data.map((row, index) => ({
        key: row.id_dwg,
        no: index + 1 + ".",
        nama: row.nama,
      }));
      setInitialData(supplierData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nama = (item.nama || "-").toString();
      const searchValue = value.toString();

      return nama.toLowerCase().includes(searchValue.toLowerCase());
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(initialData);
    fetchSupplier();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const { data, error } = await supabase.from("dwg_supplier").insert([
        {
          id_dwg: await supabase
            .from("dwg_supplier")
            .select("id_dwg", { count: "exact", head: true })
            .then((r) => r.count + 1),
          nama: values.namasupplier,
        },
      ]);
      if (error) {
        console.error("Error inserting data:", error);
      } else {
        fetchSupplier();
      }
      onClose();
      form.resetFields();

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menambah supplier",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Supplier baru berhasil ditambahkan",
          placement: "top",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error on submit data!");
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah supplier",
        placement: "top",
        duration: 3,
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <Drawer
          width={720}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Tambah Supplier</p>}
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
                  name="namasupplier"
                  label="Nama Supplier"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="namasupplier"
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
          </Form>
        </Drawer>

        <Drawer
          width={720}
          onClose={() => hideEditDrawer()}
          open={editDrawerOpen}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Edit Supplier</p>}
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
                  name="namasupplier"
                  label="Nama Supplier"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="namasupplier"
                    placeholder="Masukkan nama supplier"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium col-span-1">
            Kelola DWG Supplier
          </h1>
          <div className="grid gap-4">
            <button
              onClick={showDrawer}
              type="submit"
              className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
            >
              Tambah Supplier
            </button>
          </div>
        </div>

        <div>
          <Input
            placeholder="Cari Nama Supplier"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
        </div>
        <Flex gap="middle" vertical>
          <Table
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

export default Supplier;
