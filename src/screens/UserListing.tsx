import { useEffect, useState } from 'react'
import { fetchData } from '../api/apiCall';
import { Card, Row, Col, Avatar, Modal, Form, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';
import Loader from '../components/loader';

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
}

interface Company {
    name: string;
    catchPhrase: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    address: Address;
    company: Company;
    liked?: boolean;
}

const UserListing = () => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [form] = Form.useForm();

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const data = await fetchData()
            setUsers(data)
            setLoading(false)
        }

        getData()
    }, [])


    const handleEdit = (user: User) => {
        setEditingUser(user)
        form.setFieldsValue(user)
    }

    const toggleLike = (userId: number) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === userId ? { ...user, liked: !user.liked } : user
            )
        )
    }

    const handleEditSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === editingUser?.id ? { ...user, ...values } : user
                    )
                )
                setEditingUser(null)
                form.resetFields()
            })
            .catch((err) => console.log('Validation failed:', err))
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <Row gutter={[24, 24]} >
                    {users.map((user) => {
                        const svg = createAvatar(personas, { seed: user.username, size: 64 }).toString();
                        return (
                            <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
                                <Card
                                    title={
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginBottom: 20,
                                            }}>
                                                <div style={{
                                                    width: 120,
                                                    height: 120,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e6f7ff',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                }}>
                                                    <Avatar
                                                        size={100}
                                                        shape="circle"
                                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
                                                    />
                                                </div>

                                            </div>
                                            <p style={{ textAlign: "center" }}><strong>Username:</strong> {user.username}</p>
                                        </>
                                    }
                                    actions={[
                                        user.liked ? (
                                            <HeartFilled
                                                key="like"
                                                style={{ color: 'red' }}
                                                onClick={() => toggleLike(user.id)}
                                            />
                                        ) : (
                                            <HeartOutlined
                                                key="like"
                                                onClick={() => toggleLike(user.id)}
                                            />
                                        ),
                                        <EditOutlined key="edit" onClick={() => handleEdit(user)} />,
                                        <Popconfirm
                                            key="delete"
                                            title="Are you sure to delete this user?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() =>
                                                setUsers((prev) => prev.filter((u) => u.id !== user.id))
                                            }
                                        >
                                            <DeleteOutlined />
                                        </Popconfirm>,
                                    ]}
                                    style={{ paddingTop: "20px", textAlign: "left" }}
                                >
                                    <p>
                                        <strong>Name:</strong> {user.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> {user.phone}
                                    </p>
                                    <p>
                                        <strong>Website:</strong> {user.website}
                                    </p>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>)}

            <Modal
                title="Edit User"
                open={!!editingUser}
                onCancel={() => setEditingUser(null)}
                onOk={handleEditSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[{ required: true, message: 'Please enter phone' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="website"
                        label="Website"
                        rules={[{ required: true, message: 'Please enter website' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default UserListing