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
  Modal,
  Descriptions,
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

const PartAnak = () => {
  const [maker, setMaker] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState([]);
  const [supplierLokal, setSupplierLokal] = useState([]);
  const [supplierImpor, setSupplierImpor] = useState([]);
  const [idPartAnak, setIdPartAnak] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dwgSupplier, setDwgSupplier] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    setIdPartAnak(values.key);
    setEditDrawerOpen(true);

    console.log(values);

    editForm.setFieldsValue({
      id_pa: values.key,
      namapartanak: values.part_name,
      dwgsupplier: values.dwg,
      nopartanak: values.nomor_pa,
      nopartanakupdate: values.nomor_pa_update,
      supplier: (() => {
        const lokal = values.supplier ? `${row.nama_lokal} (lokal)` : "";
        const impor = row.nama_impor ? `${row.nama_impor} (impor)` : "";
        return [lokal, impor].filter(Boolean).join(", ") || "-";
      })(),
    });
  };

  const hideEditDrawer = () => {
    setEditDrawerOpen(false);
    editForm.resetFields();
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
      title: "No Part Anak",
      dataIndex: "nomor_pa",
    },
    {
      title: "No Part Anak Update",
      dataIndex: "nomor_pa_update",
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
            title="Ubah part anak"
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
            description="Anda yakin ingin menghapus part anak ini?"
            onConfirm={(e) => {
              handleDeletePartAnak(record.key);
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
              title="Hapus part anak"
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleRowClick = (record) => {
    // console.log("Selected Record:", record);
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const fetchPartAnak = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("view_part_anak_detail")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      const partAnakData = response.map((row, index) => ({
        key: row.id_pa,
        no: index + 1 + ".",
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
      setInitialData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartAnak();
  }, []);

  const fetchDWGSupplier = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("dwg_supplier")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      setDwgSupplier(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setDwgSupplier([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDWGSupplier();
  }, []);

  const fetchMaterial = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("material")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      setMaterial(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setMaterial([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const fetchMaker = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("maker")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      setMaker(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setMaker([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaker();
  }, []);

  const fetchSupplierLokal = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("supp_lokal")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      setSupplierLokal(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setSupplierLokal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierLokal();
  }, []);

  const fetchSupplierImpor = async () => {
    try {
      const { data: response, error: responseError } = await supabase
        .from("supp_impor")
        .select("*");

      if (responseError) {
        console.error("Error fetching data:", error);
      }

      setSupplierImpor(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setSupplierImpor([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierImpor();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nomorPa = (item.nomor_pa || "-").toString();
      const nomorPaUpdate = (item.nomor_pa_update || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPa.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPaUpdate.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(initialData);
    fetchPartAnak();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const handleSubmit = async (values) => {
    try {
      const { data, error } = await supabase.from("part_anak").insert([
        {
          id_pa: await supabase
            .from("part_anak")
            .select("id_pi", { count: "exact", head: true })
            .then((r) => r.count + 1),
          no_part: values.nopartanak,
          no_part_update: values.nopartanakupdate,
        },
      ]);
      if (error) {
        console.error("Error inserting data:", error);
      }
      onClose();
      form.resetFields();

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menambah part anak",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part anak baru berhasil ditambahkan",
          placement: "top",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error on submit data!");
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah part anak",
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
        .from("part_anak")
        .update({ nama: values.nama })
        .eq("id_pa", id_pa);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat mengubah supplier",
          placement: "top",
          duration: 3,
        });
        hideEditDrawer();
        fetchPartAnak();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Supplier berhasil diubah",
          placement: "top",
          duration: 5,
        });
        hideEditDrawer();
        fetchPartAnak();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat mengubah supplier",
        placement: "top",
        duration: 3,
      });
      hideEditDrawer();
      fetchPartAnak();
    }
  };

  const handleDeletePartAnak = async (values) => {
    try {
      const { data, error } = await supabase
        .from("part_anak")
        .delete()
        .eq("id_pa", values);

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menghapus part anak",
          placement: "top",
          duration: 3,
        });

        fetchPartAnak();
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part anak berhasil dihapus",
          placement: "top",
          duration: 5,
        });

        fetchPartAnak();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menghapus part anak",
        placement: "top",
        duration: 3,
      });

      fetchPartAnak();
    }
  };

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <Drawer
          // title="Buat Anggaran"
          width={720}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Tambah Part Anak</p>}
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
                  label="Nomor Part Anak"
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
                    placeholder="Masukkan nomor part anak"
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
                  label="Nomor Part Anak Update"
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
                    placeholder="Masukkan nomor part anak update"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    // required
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
          extra={<p className="text-lg font-bold">Edit Supplier Impor</p>}
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
                  name="nopartanak"
                  label="No Part"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartanak"
                    placeholder="Masukkan no part anak"
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
                  name="nopartanakupdate"
                  label="No Part Anak Update"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartanakupdate"
                    placeholder="Masukkan no part anak update"
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
                  name="namapartanak"
                  label="Nama Part Anak"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="namapartanak"
                    placeholder="Masukkan nama part anak"
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
                  name="dwgsupplier"
                  label="DWG Supplier"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Pilih dwg supplier"
                    style={{
                      minHeight: 39,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option.nama.toLowerCase().includes(input.toLowerCase())
                    }
                    options={dwgSupplier.map((item) => ({
                      label: <span key={item.id_dwg}>{item.nama}</span>,
                      value: item.id_dwg,
                      nama: item.nama,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="maker"
                  label="Maker"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Pilih maker"
                    style={{
                      minHeight: 39,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option.nama.toLowerCase().includes(input.toLowerCase())
                    }
                    options={maker.map((item) => ({
                      label: <span key={item.id_maker}>{item.nama}</span>,
                      value: item.id_maker,
                      nama: item.nama,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="supplier"
                  label="Supplier"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Pilih supplier"
                    style={{
                      minHeight: 39,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option.nama.toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                      {
                        label: "Supplier Lokal",
                        options: supplierLokal.map((item) => ({
                          label: <span key={item.id_lokal}>{item.nama}</span>,
                          value: item.id_lokal,
                          nama: item.nama,
                        })),
                      },
                      {
                        label: "Supplier Impor",
                        options: supplierImpor.map((item) => ({
                          label: <span key={item.id_impor}>{item.nama}</span>,
                          value: item.id_impor,
                          nama: item.nama,
                        })),
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="supplierimpor"
                  label="Supplier Impor"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Pilih supplier impor"
                    style={{
                      minHeight: 39,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option.nama.toLowerCase().includes(input.toLowerCase())
                    }
                    options={supplierImpor.map((item) => ({
                      label: <span key={item.id_impor}>{item.nama}</span>,
                      value: item.id_impor,
                      nama: item.nama,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row> */}

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="material"
                  label="Material"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className="w-full"
                    placeholder="Pilih material"
                    style={{
                      minHeight: 39,
                    }}
                    allowClear
                    filterOption={(input, option) =>
                      option.nama.toLowerCase().includes(input.toLowerCase())
                    }
                    options={material.map((item) => ({
                      label: <span key={item.id_material}>{item.nama}</span>,
                      value: item.id_material,
                      nama: item.nama,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium col-span-1">Kelola Part Anak</h1>
          <div className="grid gap-4">
            <button
              onClick={showDrawer}
              type="submit"
              className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
            >
              Tambah Part Anak
            </button>
          </div>
        </div>

        <div>
          <Input
            placeholder="Cari Nomor Part Anak"
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            loading={loading}
          />

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
        </Flex>
      </div>
    </div>
  );
};

export default PartAnak;
