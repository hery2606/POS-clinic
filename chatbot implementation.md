# Frontend Chatbot Integration

Panduan integrasi ClinicBot API ke React/Vite frontend.

## 1. Config `.env`
Frontend butuh URL backend. Edit/buat `.env` di folder frontend:

```env
API_BASE_URL=https://clinic-analytics-api-production.up.railway.app/docs#/
```

## 2. Install Dependencies
Backend kirim balasan dalam format Markdown (ada teks tebal, link navigasi). Butuh parser:

```bash
npm install react-markdown
```

## 3. Fungsi Fetch (API Call)
Kirim `question` dan `frontend_routes` (opsional) agar bot tahu halaman apa saja yang bisa diklik user.
di bawah ini hanya contoh saja, silahkan ubah sesuai dengan project yang sedang dibuat.

contoh:

```javascript
// src/api/chatbot.js
export const askChatbot = async (question, history = []) => {
  const url = `${import.meta.env.VITE_API_BASE_URL}/chatbot/ask`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: question,
      history: history, // Format: [{role: "user", content: "hi"}, ...]
      frontend_routes: [
        { name: "Dashboard Utama", path: "/dashboard" },
        { name: "Transaksi", path: "/dashboard/transactions" },
        { name: "Analytics", path: "/dashboard/analytics" }
      ]
    })
  });

  if (!response.ok) throw new Error("API Error");
  return response.json();
};


```
note: Jangan lupa import function askChatbot dari file chatbot.js ke dalam component yang akan digunakan. 

## 4. Render UI Component
Gunakan `react-markdown` untuk merender balasan bot. Ubah tag `<a>` bawaan Markdown menjadi `<Link>` agar SPA tidak ter-reload saat link diklik.

```jsx
// src/components/ChatBubble.jsx
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom"; // Pakai react-router

export default function ChatBubble({ text, isBot }) {
  return (
    <div className={`p-3 rounded-lg ${isBot ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <ReactMarkdown
        components={{
          // Cegah page reload, routing pakai react-router
          a: ({ node, ...props }) => (
            <Link to={props.href} className="text-blue-600 hover:underline">
              {props.children}
            </Link>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
```

## 5. buat file chatbot.js di dalam folder src/api


## 6. buat struktural file dan folder yang rapih implementasi chatbot ini menjadi rapih dan mudah di baca 

buat implementasi chatbot ini hanya di dalam analitik dashborad saja 

## 7. minimkan error saat implementasi

## 8. buat desain chatbot ini agar terlihat menarik dan mudah di gunakan juga responsive dan tema nya sesuai dengan website capston pos qris gii nama chatbot nya ClinicBot


1. endpoint api = POST/api/v1/chatbot/ask

2. body request = 
{
  "question": "Mengapa omzet QRIS turun minggu ini?",
  "period": "weekly", <--- ada 4 yaitu daily, weekly, monthly, yearly dan ini opsional ga wajib bagi chatbot  

  ini bentuk contoh implementasi 
  "frontend_routes": [      
    {
      "name": "Dashboard Utama",
      "path": "/dashboard"
    }
  ],
  "history": [
    {
      "role": "string",
      "content": "string"
    }
  ]
}

3. response = 
{
  "question": "Mengapa omzet QRIS turun minggu ini?",
  "answer": "📊 **Analisis QRIS** (Periode: weekly)\n\n1. **Revenue QRIS**: Rp 10,000 dari total Rp 10,000\n2. **Metode Dominan**: QRIS mendominasi transaksi saat ini\n3. **Total Transaksi**: 1 transaksi tercatat\n\n💡 **Rekomendasi**: Periksa apakah stiker QRIS di meja kasir masih mudah dipindai dan pastikan kasir selalu menawarkan opsi QRIS kepada pasien.",
  "context_period": "weekly",
  "data_snapshot_at": "2026-06-29T07:35:09.049832+00:00Z",
  "model": "mock-analyst (groq-fallback)",
  "tokens_used": 0,
  "error_detail": "Error code: 400 - {'error': {'message': \"'messages.1' : discriminator property 'role' has invalid value\", 'type': 'invalid_request_error'}}"
}





ini endpoint nya  masukkan ke dalam  chatbot service 
Analytics


GET
/api/v1/analytics/payment-methods
Metode Pembayaran (Split Bill)
{
  "meta": {
    "date_from": "2026-06-01",
    "date_to": "2026-06-28",
    "total_transactions": 15,
    "total_revenue": 945000
  },
  "data": {
    "by_primary_method": [
      {
        "method": "QRIS",
        "count": 10,
        "total_amount": 565000,
        "percentage": 66.67,
        "patient_names": [
          "Siti Rahmawati",
          "Ahmad Kurniawan",
          "Yuli Santoso"
        ]
      },
      {
        "method": "CASH",
        "count": 5,
        "total_amount": 380000,
        "percentage": 33.33,
        "patient_names": [
          "Ahmad Kurniawan",
          "Yuli Santoso"
        ]
      }
    ],
    "split_bill_analysis": {
      "total_split_transactions": 10,
      "common_combinations": [
        {
          "combo": [
            "CASH",
            "QRIS"
          ],
          "count": 6
        },
        {
          "combo": [
            "CASH",
            "CASH"
          ],
          "count": 3
        },
        {
          "combo": [
            "CASH",
            "QRIS",
            "QRIS"
          ],
          "count": 1
        }
      ]
    },
    "bpjs_vs_umum": {
      "bpjs": {
        "count": 0,
        "total_bpjs_amount": 0,
        "total_non_bpjs_amount": 0,
        "patient_names": []
      },
      "umum": {
        "count": 15,
        "total_amount": 945000,
        "patient_names": [
          "Siti Rahmawati",
          "Ahmad Kurniawan",
          "Yuli Santoso"
        ]
      }
    },
    "trend_weekly": [
      {
        "week": "2026-W24",
        "QRIS": 565000,
        "CASH": 380000,
        "TRANSFER": 0,
        "DEBIT": 0
      }
    ]
  }
}


GET
/api/v1/analytics/revenue
Tren Revenue Finansial
{
  "meta": {
    "date_from": "2026-06-01",
    "date_to": "2026-06-28"
  },
  "data": {
    "total_revenue": 1015000,
    "total_billed": 1140000,
    "outstanding": {
      "count": 3,
      "total_remaining": 25000
    },
    "avg_transaction_value": 63333.33,
    "by_status": {
      "LUNAS": {
        "count": 15,
        "amount": 945000
      },
      "PARTIAL": {
        "count": 2,
        "amount": 70000
      },
      "PENDING_PAYMENT": {
        "count": 1,
        "amount": 100000
      },
      "CANCELLED": {
        "count": 1,
        "amount": 0
      }
    },
    "trend_daily": [
      {
        "date": "2026-06-11",
        "revenue": 350000,
        "transactions": 6
      },
      {
        "date": "2026-06-12",
        "revenue": 575000,
        "transactions": 10
      },
      {
        "date": "2026-06-14",
        "revenue": 90000,
        "transactions": 2
      }
    ]
  }
}


GET
/api/v1/analytics/summary
Ringkasan Analitik Dashboard
{
  "period": "weekly",
  "generated_at": "2026-06-29T09:36:00.793644Z",
  "data": {
    "total_revenue": 10000,
    "total_billed": 10000,
    "total_transactions": 1,
    "avg_transaction_value": 10000,
    "outstanding_amount": 0,
    "outstanding_count": 0,
    "top_payment_method": "QRIS",
    "bpjs_coverage_pct": 100,
    "split_bill_pct": 100,
    "revenue_by_method": {
      "QRIS": 10000,
      "CASH": 0,
      "TRANSFER": 0,
      "DEBIT": 0
    },
    "status_breakdown": {
      "LUNAS": 1,
      "PARTIAL": 0,
      "PENDING_PAYMENT": 0,
      "CANCELLED": 0
    }
  }
}

POST
/api/v1/analytics/etl/trigger
Picu Sinkronisasi ETL Manual



GET
/api/v1/analytics/etl/status
Cek Status Sinkronisasi ETL


GET
/api/v1/analytics/top-spend
Analisis Top Spend
{
  "meta": {
    "date_from": "2026-06-01",
    "date_to": "2026-06-28",
    "total_transactions": 23,
    "total_spend": 1455000
  },
  "data": {
    "top_by_insurance_type": [
      {
        "type": "UMUM",
        "total_spend": 1140000,
        "count": 18
      },
      {
        "type": "BPJS",
        "total_spend": 315000,
        "count": 5
      }
    ],
    "top_by_payment_method": [
      {
        "method": "QRIS",
        "total_paid": 865000,
        "count": 14
      },
      {
        "method": "CASH",
        "total_paid": 465000,
        "count": 8
      }
    ],
    "value_distribution": [
      {
        "range": "< Rp 100.000",
        "count": 18
      },
      {
        "range": "Rp 100.000 - 500.000",
        "count": 5
      },
      {
        "range": "Rp 500.000 - 1.000.000",
        "count": 0
      },
      {
        "range": "Rp 1.000.000 - 5.000.000",
        "count": 0
      },
      {
        "range": "> Rp 5.000.000",
        "count": 0
      }
    ],
    "top_transactions": [
      {
        "transaction_id": "4a313379-64f9-4832-bffe-41dc08c9c260",
        "patient_name": "Budi Santoso",
        "total": 200000,
        "paid_amount": 200000,
        "payment_method": "QRIS",
        "insurance_type": "BPJS",
        "status": "LUNAS",
        "created_at": "2026-06-11T16:38:21.425+00:00"
      },
      {
        "transaction_id": "2956d328-3b84-4491-b1ed-56e39b15bcd1",
        "patient_name": "Ahmad Kurniawan",
        "total": 100000,
        "paid_amount": 100000,
        "payment_method": "CASH",
        "insurance_type": "UMUM",
        "status": "PENDING_PAYMENT",
        "created_at": "2026-06-12T08:03:06.892+00:00"
      },
      {
        "transaction_id": "b48ac785-698f-4446-ac53-96500637f31f",
        "patient_name": "Yuli Santoso",
        "total": 100000,
        "paid_amount": 100000,
        "payment_method": "CASH",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-12T07:56:00.153+00:00"
      },
      {
        "transaction_id": "cb2ba425-8111-48b0-a2a5-a06af4a22460",
        "patient_name": "Ahmad Kurniawan",
        "total": 100000,
        "paid_amount": 100000,
        "payment_method": "CASH",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-12T07:48:26.47+00:00"
      },
      {
        "transaction_id": "e8671e44-97d0-46b8-af52-ec4208cd0ab4",
        "patient_name": "Ahmad Kurniawan",
        "total": 100000,
        "paid_amount": 100000,
        "payment_method": "QRIS",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-11T14:29:59.847+00:00"
      },
      {
        "transaction_id": "64c99514-0d6c-4c4a-b483-0de55d0a66e9",
        "patient_name": "Yuli Santoso",
        "total": 75000,
        "paid_amount": 75000,
        "payment_method": "CASH",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-12T06:41:13.711+00:00"
      },
      {
        "transaction_id": "76f4ac42-bd08-45e4-b23f-f60eabafab02",
        "patient_name": "Ahmad Kurniawan",
        "total": 75000,
        "paid_amount": 75000,
        "payment_method": "QRIS",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-11T14:21:00.126+00:00"
      },
      {
        "transaction_id": "13b5aecf-65a0-4a95-8ee1-fa60da292484",
        "patient_name": "Yuli Santoso",
        "total": 60000,
        "paid_amount": 60000,
        "payment_method": "CASH",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-14T16:18:51.996+00:00"
      },
      {
        "transaction_id": "ed0fd934-f66f-4749-b61a-92396f4cf713",
        "patient_name": "Yuli Santoso",
        "total": 60000,
        "paid_amount": 60000,
        "payment_method": "QRIS",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-12T07:55:33.343+00:00"
      },
      {
        "transaction_id": "84816ac9-63c8-431e-843d-34d9e8a609d0",
        "patient_name": "Ahmad Kurniawan",
        "total": 60000,
        "paid_amount": 60000,
        "payment_method": "QRIS",
        "insurance_type": "UMUM",
        "status": "LUNAS",
        "created_at": "2026-06-12T07:51:08.126+00:00"
      }
    ]
  }
}

GET
/api/v1/analytics/top-items
Obat & Layanan Terlaris
{
  "meta": {
    "date_from": "2026-06-01",
    "date_to": "2026-06-28",
    "total_items_sold": 75,
    "total_items_revenue": 855000,
    "unique_items": 2
  },
  "data": {
    "top_by_quantity": [
      {
        "item_name": "Vitamin C 1000mg",
        "item_type": "OBAT",
        "total_quantity": 48,
        "total_revenue": 720000,
        "transaction_count": 15,
        "avg_price": 15000
      },
      {
        "item_name": "Paracetamol 500mg",
        "item_type": "OBAT",
        "total_quantity": 27,
        "total_revenue": 135000,
        "transaction_count": 3,
        "avg_price": 5000
      }
    ],
    "top_by_revenue": [
      {
        "item_name": "Vitamin C 1000mg",
        "item_type": "OBAT",
        "total_quantity": 48,
        "total_revenue": 720000,
        "transaction_count": 15,
        "avg_price": 15000
      },
      {
        "item_name": "Paracetamol 500mg",
        "item_type": "OBAT",
        "total_quantity": 27,
        "total_revenue": 135000,
        "transaction_count": 3,
        "avg_price": 5000
      }
    ],
    "by_type": [
      {
        "item_type": "OBAT",
        "total_quantity": 75,
        "total_revenue": 855000,
        "unique_items_count": 2
      }
    ],
    "by_insurance": {
      "BPJS": {
        "total_quantity": 9,
        "total_revenue": 115000
      },
      "UMUM": {
        "total_quantity": 66,
        "total_revenue": 740000
      }
    }
  }
}


GET
/api/v1/analytics/ai-insight
Analisis AI Insight Keuangan & Operasional


{
  "insight": "### 1. Ringkasan Eksekutif Keuangan\n- Pendapatan bersih **Rp 1.330.000** dari tagihan **Rp 1.455.000** (rasio tagihan ≈ 91 %).  \n- Rata‑rata nilai transaksi **Rp 63.261** per transaksi (23 transaksi).  \n- 20 transaksi (≈ 87 %) sudah lunas; hanya **3 transaksi** (total **Rp 25.000**) masih outstanding.  \n- Metode pembayaran dominan **QRIS** (62,5 % transaksi, kontribusi **Rp 865.000**).  \n\n### 2. Analisis Pembayaran & Operasional\n- **QRIS** vs **CASH**: QRIS 15 transaksi, **Rp 865.000**; CASH 9 transaksi, **Rp 465.000**.  \n- **Split‑bill** terjadi pada **14 transaksi** (≈ 61 %); kombinasi paling umum adalah **CASH + QRIS** (8 kali).  \n- **BPJS** hanya 5 transaksi (21,7 %); total nilai **Rp 290.000** dibanding **Umum** 19 transaksi **Rp 1.015.000**.  \n- Tren mingguan menunjukkan penurunan tajam QRIS pada minggu 2026‑W26 (hanya **Rp 10.000**).  \n\n### 3. Pasien & Layanan Terlaris\n- **Top spender**: pasien umum menghabiskan **Rp 1.140.000** (18 transaksi); BPJS **Rp 315.000** (5 transaksi).  \n- **Layanan**: *Konsultasi Dokter* menghasilkan **Rp 800.000** (8 kali, rata‑rata **Rp 100.000** per layanan) – paling menguntungkan per unit.  \n- **Obat**: *Vitamin C 1000 mg* terjual 48 pcs, pendapatan **Rp 720.000** (harga rata‑rata **Rp 15.000**). *Paracetamol 500 mg* 27 pcs, **Rp 135.000**.  \n\n### 4. Rekomendasi Taktis\n1. **Perkuat QRIS & split‑bill** – promosikan pembayaran QRIS dengan diskon 2 % untuk transaksi split, karena kombinasi QRIS + CASH sudah terbukti paling sering dan memberi kontribusi terbesar pada pendapatan.  \n2. **Tindak lanjuti outstanding** – kirim reminder otomatis ke ",
  "date_from": "2026-06-01",
  "date_to": "2026-06-28",
  "model": "openai/gpt-oss-120b",
  "generated_at": "2026-06-29T09:37:20.128584+00:00Z"
}
