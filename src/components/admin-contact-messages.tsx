"use client";

import { useState, useTransition } from "react";
// Note: This component uses API routes for server actions

interface ContactMessage {
  id: string;
  name: string;
  last_name: string | null;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ContactMessagesTableProps {
  messages: ContactMessage[];
}

export default function ContactMessagesTable({ messages: initialMessages }: ContactMessagesTableProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/admin/contact-messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getSubjectDisplay = (subject: string) => {
    const subjectMap: { [key: string]: string } = {
      general: "General Inquiry",
      product: "Product Question",
      sizing: "Sizing Help",
      order: "Order Support",
      return: "Returns & Exchanges",
      other: "Other"
    };
    return subjectMap[subject] || subject;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">📬</span>
            <span className="text-blue-800">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Subject</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p>No contact messages yet</p>
                      <p className="text-sm">Messages submitted through the contact form will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        message.is_read 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {message.is_read ? '✅ Read' : '🔵 New'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {message.name} {message.last_name || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {message.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {getSubjectDisplay(message.subject)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        {!message.is_read && (
                          <button
                            onClick={() => markAsRead(message.id)}
                            disabled={isPending}
                            className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="border-b p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Message from {selectedMessage.name} {selectedMessage.last_name || ''}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedMessage.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900">{getSubjectDisplay(selectedMessage.subject)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-between">
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${getSubjectDisplay(selectedMessage.subject)}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📧 Reply via Email
                </a>
                {!selectedMessage.is_read && (
                  <button
                    onClick={() => {
                      markAsRead(selectedMessage.id);
                      setSelectedMessage({ ...selectedMessage, is_read: true });
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Mark as Read
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
