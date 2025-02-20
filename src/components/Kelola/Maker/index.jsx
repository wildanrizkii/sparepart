"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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

const Maker = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [idMaker, setIdMaker] = useState("");
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
    setIdMaker(values.key);
    setEditDrawerOpen(true);

    editForm.setFieldsValue({
      id_maker: values.key,
      namamaker: values.nama,
    });
  };

  const hideEditDrawer = () => {
    setEditDrawerOpen(false);
    editForm.resetFields();
  };

  const handleEdit = async (values) => {
    try {
      const { data, error } = await supabase
        .from("maker")
        .update({ nama: values.namamaker })
        .eq("id_maker", idMaker);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat mengubah maker",
          placement: "top",
          duration: 3,
        });
        hideEditDrawer();
        fetchMaker();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Maker berhasil diubah",
          placement: "top",
          duration: 5,
        });
        hideEditDrawer();
        fetchMaker();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat mengubah maker",
        placement: "top",
        duration: 3,
      });
      hideEditDrawer();
      fetchMaker();
    }
  };

  const handleDeleteMaker = async (values) => {
    try {
      const { data, error } = await supabase
        .from("maker")
        .delete()
        .eq("id_maker", values);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menghapus maker",
          placement: "top",
          duration: 3,
        });

        fetchMaker();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Maker berhasil dihapus",
          placement: "top",
          duration: 5,
        });

        fetchMaker();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menghapus maker",
        placement: "top",
        duration: 3,
      });

      fetchMaker();
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
      key: "no",
      align: "center",
    },
    {
      title: "Nama Maker",
      dataIndex: "nama",
      key: "nama",
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
            title="Ubah maker"
            onClick={() => showEditDrawer(record)}
          >
            <EditOutlined />
          </button>

          <Popconfirm
            placement="bottomRight"
            cancelText="Batal"
            okText="Hapus"
            title="Konfirmasi"
            description="Anda yakin ingin menghapus maker ini?"
            onConfirm={() => handleDeleteMaker(record.key)}
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
              title="Hapus maker"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchMaker = async () => {
    try {
      const { data, error } = await supabase.from("maker").select("*");
      const makerData = data.map((row, index) => ({
        key: row.id_maker,
        no: index + 1 + ".",
        nama: row.nama,
      }));
      setInitialData(makerData);
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
    fetchMaker();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const handleSubmit = async (values) => {
    try {
      const { data, error } = await supabase.from("maker").insert([
        {
          id_maker: await supabase
            .from("maker")
            .select("id_maker", { count: "exact", head: true })
            .then((r) => r.count + 1),
          nama: values.namamaker,
        },
      ]);
      if (error) {
        console.error("Error inserting data:", error);
      } else {
        fetchMaker();
      }
      onClose();
      form.resetFields();

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menambah maker",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Maker baru berhasil ditambahkan",
          placement: "top",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error on submit data!");
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah maker",
        placement: "top",
        duration: 3,
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="max-w-screen-xl">
      <div className="space-y-4">
        <Drawer
          width={720}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Tambah Maker</p>}
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
                  name="namamaker"
                  label="Nama Maker"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="namamaker"
                    placeholder="Masukkan nama maker"
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
          extra={<p className="text-lg font-bold">Edit Maker</p>}
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
                  name="namamaker"
                  label="Nama Maker"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="namamaker"
                    placeholder="Masukkan nama maker"
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
          <h1 className="text-2xl font-medium col-span-1">Kelola Maker</h1>
          <div className="grid gap-4">
            <button
              onClick={showDrawer}
              type="submit"
              className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
            >
              Tambah Maker
            </button>
          </div>
        </div>

        <div>
          <Input
            placeholder="Cari Nama Maker"
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
            // onRow={(record) => ({
            //   // onClick: (e) => handleRowClick(e, record),
            //   onClick: (e) => console.log(filteredData),
            //   style: { cursor: "pointer" },
            // })}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </Flex>
      </div>
    </div>
  );
};

export default Maker;
