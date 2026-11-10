import type { AuthorProfile, Category, Work } from "@/lib/types";

/**
 * Data awal (seed) untuk penyimpanan lokal.
 * Setelah aplikasi berjalan, suntingan admin tersimpan di .data/store.json
 * dan tidak lagi mengubah file ini.
 */

export const categories: Category[] = [
  {
    slug: "puisi",
    name: "Puisi",
    description: "Baris-baris yang menyimpan yang tak terucap.",
  },
  {
    slug: "cerpen",
    name: "Cerpen",
    description: "Potongan hidup yang selesai dalam satu duduk.",
  },
  {
    slug: "esai",
    name: "Esai",
    description: "Renungan atas bahasa, ingatan, dan keseharian.",
  },
  {
    slug: "artikel",
    name: "Artikel",
    description: "Catatan praktik mengajar dan dunia pendidikan.",
  },
  {
    slug: "drama",
    name: "Drama",
    description: "Percakapan yang diberi panggung dan cahaya.",
  },
];

export const works: Work[] = [
  {
    id: "w-01",
    title: "Jejak yang Tertinggal",
    slug: "jejak-yang-tertinggal",
    category: "puisi",
    featured: true,
    status: "published",
    publishedAt: "2026-10-18",
    excerpt:
      "Tentang langkah yang berhenti di depan rumah yang sudah lama ditinggalkan, dan ingatan yang menolak ikut pindah.",
    content: `Di ujung gang, senja menunda pulang
dan bayang-bayang memanjang seperti doa
yang lupa diucapkan.

Aku menelusuri batu-batu yang retak,
menghitung langkah yang dulu berhenti
tepat di depan pintu rumahmu.

Daun jambu jatuh tanpa suara.
Di teras itu, kursi kayu masih setia
menunggu tubuh yang tak lagi pulang.

Ada jejak yang tidak hilang
meski hujan telah tiga kali
menyapu halaman.

Maka aku belajar berjalan pelan—
sebab yang tertinggal bukan hanya jejak,
tetapi juga sebagian diriku
yang memilih tinggal.`,
  },
  {
    id: "w-02",
    title: "Pulang pada Musim Kemarau",
    slug: "pulang-pada-musim-kemarau",
    category: "cerpen",
    featured: true,
    status: "published",
    publishedAt: "2026-10-02",
    excerpt:
      "Seorang perempuan kembali ke kampung halaman setelah bertahun-tahun, menemukan sumur yang mengering dan ibu yang tetap menyimpan air untuknya.",
    content: `Kereta terakhir berangkat pukul sembilan malam, tetapi Rani sudah duduk di peron sejak setengah jam sebelumnya. Ia memegang tiket dengan cara orang memegang sesuatu yang mudah hilang: erat, sedikit gemetar.

Di luar jendela, sawah-sawah berubah menjadi bidang gelap yang sesekali disorot lampu rumah. Rani menghitung tiang listrik untuk mengusir kantuk, lalu berhenti ketika sadar bahwa ia sudah tidak mengenali jalan pulang.

Kampungnya menyambutnya dengan debu. Jalan setapak menuju rumah masih sama, hanya lebih sempit daripada yang ia ingat. Di ujungnya, lampu teras menyala kuning, dan sesosok perempuan tua berdiri dengan selendang di pundak, seolah sudah menunggu sejak subuh.

"Airnya habis," kata ibunya, sebelum Rani sempat meletakkan tas. "Sumur sudah kering sejak bulan lalu."

Rani mengangguk. Ia ingin mengatakan banyak hal—tentang pekerjaan, tentang kota, tentang malam-malam yang ia habiskan menatap langit-langit kamar—tetapi yang keluar hanya, "Nanti saya antar air, Bu."

Mereka duduk di dapur. Ibu menuangkan teh dari ceret yang sudah penyok, lalu bercerita tentang tetangga yang pindah, tentang pohon mangga yang tak lagi berbuah, tentang ayah yang menjelang akhir hidupnya sering duduk di kursi teras sambil membaca buku-buku lama.

"Bapak bilang, musim kemarau tidak pernah selamanya," kata ibunya. "Katanya, yang penting kita tahu ke mana harus pulang."

Rani menatap cangkirnya. Uap teh naik perlahan, seperti doa yang tidak ingin terburu-buru.

Malam itu, untuk pertama kalinya setelah bertahun-tahun, ia tidur tanpa membuka ponsel. Ia mendengar jangkrik, mendengar angin menyentuh atap seng, mendengar ibunya berjalan ke dapur untuk memastikan pintu terkunci.

Menjelang pagi, hujan turun. Gerimis kecil yang membuat tanah berbau harum. Rani berdiri di teras, membiarkan air membasahi telapak tangannya.

Ibunya muncul di sampingnya, membawa selendang. "Sumurnya belum penuh," katanya.

"Tidak apa-apa, Bu," jawab Rani. "Kita tunggu saja."

Dan untuk pertama kalinya, menunggu terasa seperti sesuatu yang tidak sia-sia.`,
  },
  {
    id: "w-03",
    title: "Rumah yang Tak Pernah Pergi",
    slug: "rumah-yang-tak-pernah-pergi",
    category: "puisi",
    status: "published",
    publishedAt: "2026-09-24",
    excerpt:
      "Rumah tidak pernah pindah. Kitalah yang berjalan terlalu jauh, lalu lupa cara mengetuk pintu.",
    content: `Rumah itu tidak pernah pindah.
Hanya kita yang beranjak,
membawa kunci di saku
tanpa pernah benar-benar mengunci apa pun.

Dindingnya masih menyimpan suara
sendok beradu di piring,
dan lampu teras yang berkedip
seperti mata yang menahan tangis.

Ibu masih menaruh air di meja
untuk tamu yang tak pernah datang.
Ayah masih membaca koran lama
di kursi yang rodanya mulai goyang.

Setiap kali aku pulang,
rumah itu menyambut dengan cara yang sama:
membuka pintu sebelum kupijak,
menyalakan lampu sebelum kusentuh.

Ah, rumah tidak pernah pergi.
Kitalah yang berjalan terlalu jauh,
lalu lupa bahwa pulang
bukan soal sampai,
melainkan soal berani mengetuk.`,
  },
  {
    id: "w-04",
    title: "Merawat Bahasa, Merawat Ingatan",
    slug: "merawat-bahasa-merawat-ingatan",
    category: "esai",
    featured: true,
    status: "published",
    publishedAt: "2026-09-15",
    excerpt:
      "Bahasa bukan sekadar alat berkomunikasi. Di dalamnya tersimpan cara sebuah keluarga, kampung, dan generasi mengingat dirinya sendiri.",
    content: `Suatu sore, seorang murid bertanya mengapa kata "pulang" terasa lebih hangat daripada kata "kembali". Saya tidak langsung menjawab. Saya meminta seluruh kelas menutup mata dan mengingat satu peristiwa yang membuat mereka ingin pulang.

Jawaban mereka beragam: aroma dapur, suara sandal di lantai, lampu yang dinyalakan sebelum magrib. Tidak ada satu pun yang menyebut definisi kamus. Mereka berbicara tentang tubuh, tentang kebiasaan, tentang hal-hal yang tidak bisa dijelaskan oleh daftar sinonim.

Di situlah saya mulai percaya bahwa bahasa adalah rumah pertama manusia. Sebelum kita memiliki alamat, kita memiliki kata. Sebelum kita mengenal sejarah, kita mengenal cerita yang diulang-ulang di meja makan.

Sayangnya, merawat bahasa tidak pernah sesederhana melestarikan daftar kosakata. Ia menuntut kita untuk terus memakainya, mengubahnya, dan membiarkannya hidup di mulut anak-anak. Bahasa yang hanya disimpan di kamus akan menjadi benda museum: indah, tetapi tidak lagi menghangatkan.

Di kelas, saya mencoba melakukan hal kecil. Setiap Jumat, murid-murid menuliskan satu kata daerah yang mereka dengar di rumah, lalu menceritakan kapan kata itu biasa dipakai. Ada yang menulis "mengkal", ada yang menulis "grapyak", ada pula yang menulis kata yang hanya dipakai neneknya ketika marah. Kelas menjadi riuh dengan tawa dan pengakuan.

Kegiatan itu tidak mengajarkan tata bahasa. Ia melakukan sesuatu yang lebih mendasar: menunjukkan bahwa bahasa mereka berharga. Bahwa cara mereka berbicara di rumah bukanlah versi yang salah dari bahasa sekolah, melainkan lapisan ingatan yang perlu dijaga.

Tentu, kita tetap perlu mengajarkan ejaan dan tanda baca. Tetapi di atas semua itu, ada tugas yang lebih besar: membuat murid percaya bahwa kata-kata mereka layak didengar. Sebab generasi yang kehilangan kepercayaan pada bahasanya akan lebih mudah kehilangan kepercayaan pada ceritanya sendiri.

Maka merawat bahasa adalah merawat ingatan. Dan merawat ingatan berarti memastikan bahwa ketika seorang anak bertanya "ke mana saya pulang?", ia masih memiliki kata-kata untuk menjawab.`,
  },
  {
    id: "w-05",
    title: "Sepasang Sepatu di Teras",
    slug: "sepasang-sepatu-di-teras",
    category: "cerpen",
    status: "published",
    publishedAt: "2026-09-03",
    excerpt:
      "Setiap pagi, Bu Lastri menemukan sepasang sepatu usang di teras rumahnya. Tidak ada yang tahu dari mana asalnya—sampai sebuah surat kecil muncul di salah satunya.",
    content: `Sepatu itu muncul pertama kali pada suatu Selasa. Sepasang sepatu kanvas putih yang sudah menguning, bagian tumitnya terkikis, tali sebelah kiri putus dan disimpul sembarangan.

Bu Lastri menemukannya di teras, tepat di depan pintu, tersusun rapi seperti seseorang baru saja melepasnya sebelum masuk. Ia melihat ke kiri dan ke kanan. Gang masih basah oleh embun, dan tidak ada seorang pun di sana.

Ia membawa sepatu itu ke dalam, menaruhnya di dekat rak, lalu melupakannya. Keesokan pagi, sepatu itu kembali di teras. Kali ini sedikit lebih bersih, seolah baru dicuci dan dikeringkan dengan tergesa.

Hari ketiga, Bu Lastri sengaja bangun lebih awal. Ia duduk di balik jendela dengan secangkir kopi, menunggu. Pukul lima, seorang lelaki muda berjalan pelan ke arah rumahnya. Ia melepas sepatu, meletakkannya di teras, lalu berdiri sebentar dengan tangan terlipat, seperti orang yang sedang berdoa.

Bu Lastri mengenali punggung itu. Ilham. Muridnya tujuh tahun lalu, yang berhenti sekolah karena harus bekerja di pasar.

Ia membuka pintu. Lelaki itu tersentak, lalu menunduk.

"Maaf, Bu. Saya tidak bermaksud mengganggu."

"Kenapa sepatunya ditaruh di sini?"

Ilham diam lama. "Dulu, setiap pagi saya lewat depan rumah Ibu untuk ke sekolah. Ibu selalu berdiri di teras, menyapa saya. Kadang Ibu bilang, 'Sepatumu sudah rusak, Ilham. Nanti kalau lulus, Ibu belikan yang baru.'"

Bu Lastri mengingatnya. Ia memang pernah mengatakan itu, sambil bercanda, kepada hampir semua muridnya.

"Saya tidak pernah lulus, Bu," kata Ilham. "Tapi saya ingin Ibu tahu, saya sudah bisa membeli sepatu sendiri."

Ia menunjuk sepatu yang masih di kakinya. Sepatu kerja yang sederhana, tetapi masih utuh.

Bu Lastri tidak berkata apa-apa. Ia masuk ke rumah, mengambil sepasang sepatu baru yang sudah lama disimpan di lemari—hadiah yang tak pernah sempat ia berikan—lalu menyerahkannya.

"Untuk anakmu," katanya. "Supaya dia tidak perlu berhenti sekolah."

Ilham menerimanya dengan tangan gemetar.

Sejak pagi itu, sepatu di teras tidak pernah muncul lagi. Tetapi setiap kali Bu Lastri menyapu halaman, ia selalu menyisakan sebersit harapan: mungkin suatu hari, sepasang sepatu kecil akan berhenti di depan pintunya, dan seorang anak akan mengetuk sambil berkata bahwa ia baru saja selesai belajar.`,
  },
  {
    id: "w-06",
    title: "Doa Sebelum Hujan",
    slug: "doa-sebelum-hujan",
    category: "puisi",
    status: "published",
    publishedAt: "2026-08-21",
    excerpt:
      "Sebelum hujan turun, aku menitipkan namamu pada angin yang lewat di antara atap-atap.",
    content: `Sebelum hujan turun,
aku menitipkan namamu pada angin
yang lewat di antara atap-atap.

Biarlah ia singgah
di jendela yang kau buka setiap pagi,
di cangkir yang kau tinggalkan setengah penuh,
di halaman yang belum selesai kau sapu.

Aku tidak meminta apa-apa.
Hanya agar hujan tahu
ke mana harus pulang
ketika aku sudah tidak lagi
bisa menemanimu menunggu.

Dan jika nanti petir menyapa,
jangan takut.
Itu hanya aku,
meminjam suara langit
untuk mengatakan:
aku masih di sini.`,
  },
  {
    id: "w-07",
    title: "Mengapa Kita Masih Membaca Puisi",
    slug: "mengapa-kita-masih-membaca-puisi",
    category: "esai",
    status: "published",
    publishedAt: "2026-08-07",
    excerpt:
      "Puisi tidak menyelesaikan masalah. Ia hanya membuat kita sanggup menatapnya lebih lama—dan itu sering kali sudah cukup.",
    content: `Setiap kali saya membuka sesi membaca puisi di kelas, selalu ada satu murid yang bertanya: "Bu, puisi itu gunanya untuk apa?"

Pertanyaan itu wajar. Kita hidup di zaman yang menuntut setiap hal memiliki fungsi yang jelas. Makanan harus bergizi, olahraga harus membakar kalori, menonton harus produktif. Puisi, dengan baris-barisnya yang berhenti di tengah kalimat, tampak seperti kemewahan yang tidak perlu.

Namun justru di situlah gunanya. Puisi mengajarkan kita untuk tidak terburu-buru memahami. Ia memberi ruang bagi hal-hal yang belum selesai, bagi perasaan yang belum memiliki nama. Dalam bahasa sehari-hari, kita sering dipaksa memilih: sedih atau marah, rindu atau biasa saja. Puisi menolak pilihan itu. Ia membiarkan keduanya duduk berdampingan.

Saya ingat seorang murid yang menulis puisi tentang ayahnya yang meninggal. Ia tidak menangis saat membacanya. Ia hanya membaca dengan suara datar, lalu duduk. Setelah kelas selesai, ia menemui saya dan berkata, "Ternyata kalau ditulis, rasanya lebih ringan."

Puisi tidak menyembuhkan luka. Tetapi ia memberi bentuk pada luka itu, sehingga kita bisa melihatnya dari luar dan tidak lagi sepenuhnya dikendalikan olehnya.

Mungkin itulah alasan kita masih membaca puisi di tengah dunia yang serba cepat. Bukan karena puisi memberikan jawaban, melainkan karena ia berani berhenti di tengah jalan dan berkata: mari kita lihat sebentar.

Dan dalam masyarakat yang semakin sulit diam, kemampuan untuk berhenti sebentar mungkin adalah bentuk keberanian yang paling langka.`,
  },
  {
    id: "w-08",
    title: "Surat untuk Senja",
    slug: "surat-untuk-senja",
    category: "puisi",
    status: "published",
    publishedAt: "2026-07-12",
    excerpt:
      "Sebuah surat yang tidak pernah dikirim, ditulis di meja tempat dua orang dulu berbagi teh dan diam.",
    content: `Senja,
aku menulis ini di meja yang sama
tempat kita dulu berbagi teh
dan diam yang tidak canggung.

Sejak kau pergi,
jam di dapur berjalan terlalu cepat.
Bahkan hujan pun terburu-buru
menyelesaikan ceritanya.

Aku belajar menyimpan hal-hal kecil:
remah roti di taplak,
bau kayu yang terbakar,
suaramu yang memanggil dari halaman.

Senja,
kalau kau bertemu dia di ujung jalan,
tolong sampaikan
bahwa aku masih menyisakan satu kursi
dan satu cangkir
yang belum pernah kupakai.

Karena sebagian perpisahan
hanya menunggu
salah satu dari kita
berhenti menghitung hari.`,
  },
  {
    id: "w-09",
    title: "Menumbuhkan Cinta Membaca di Ruang Kelas",
    slug: "menumbuhkan-cinta-membaca-di-ruang-kelas",
    category: "artikel",
    status: "published",
    publishedAt: "2026-06-18",
    excerpt:
      "Lima kebiasaan kecil yang bisa mengubah ruang kelas menjadi tempat yang ramah bagi pembaca pemula.",
    content: `Membuat murid mencintai membaca tidak bisa dilakukan dengan satu pidato di awal semester. Ia perlu ditumbuhkan lewat kebiasaan-kebiasaan kecil yang diulang tanpa henti.

Berikut beberapa praktik yang saya coba di kelas dan cukup membantu.

Pertama, sediakan waktu membaca tanpa tugas. Lima belas menit di awal pelajaran, buku bebas, tanpa laporan. Ketika membaca tidak selalu berujung pada penilaian, murid mulai memperlakukannya sebagai kegiatan, bukan kewajiban.

Kedua, bacakan cerita dengan suara nyaring. Banyak murid SMP dan SMA mengaku tidak pernah dibacakan cerita sejak SD. Membacakan satu bab pendek setiap Jumat membuat mereka mengenal irama kalimat dan menikmati cerita tanpa harus berjuang sendiri.

Ketiga, biarkan mereka memilih. Kebebasan memilih buku—termasuk komik dan novel populer—lebih penting daripada daftar bacaan yang "bermutu". Selera tumbuh dari kesenangan, bukan dari paksaan.

Keempat, buat ruang untuk berbicara tentang bacaan. Bukan resensi formal, cukup percakapan singkat: bagian mana yang paling membuat penasaran, tokoh mana yang paling menyebalkan. Diskusi membuat membaca terasa sebagai pengalaman sosial, bukan kegiatan soliter yang sunyi.

Kelima, jadilah pembaca yang terlihat. Murid meniru apa yang dilakukan gurunya jauh lebih cepat daripada apa yang dikatakan gurunya. Ketika saya membaca di sela jam istirahat, beberapa murid mulai bertanya buku apa yang sedang saya baca. Percakapan itu lebih efektif daripada sepuluh poster ajakan membaca.

Tidak ada satu metode yang cocok untuk semua kelas. Namun satu hal yang saya yakini: cinta membaca tidak lahir dari kewajiban. Ia lahir dari pengalaman yang menyenangkan, dari buku yang tepat pada waktu yang tepat, dan dari seseorang yang menunjukkan bahwa membaca adalah cara yang baik untuk menghabiskan hidup.`,
  },
  {
    id: "w-10",
    title: "Tunggu di Halte Terakhir",
    slug: "tunggu-di-halte-terakhir",
    category: "drama",
    status: "published",
    publishedAt: "2026-05-09",
    excerpt:
      "Sebuah naskah pendek tentang dua orang yang bertemu di halte terakhir, dan percakapan yang tidak sempat mereka selesaikan bertahun-tahun lalu.",
    content: `BABAK I

Halte bus di pinggir kota. Lampu jalan berkedip. Seorang perempuan duduk di bangku besi, membawa map berisi lembaran kertas. Malam hampir larut. Seorang lelaki masuk, melihat jadwal bus yang sudah pudar, lalu duduk di ujung bangku yang lain.

PEREMPUAN: Bus terakhir sudah lewat.
LELAKI: Saya tahu.
PEREMPUAN: Kalau tahu, kenapa masih duduk?
LELAKI: Menunggu.

PEREMPUAN: Menunggu apa?
LELAKI: (diam sejenak) Entahlah. Mungkin menunggu diri saya sendiri datang.

Perempuan menatap lelaki itu lebih lama.

PEREMPUAN: Kamu sering menjawab pertanyaan dengan kalimat aneh?
LELAKI: Hanya kalau pertanyaannya sulit.
PEREMPUAN: Tadi bukan pertanyaan sulit.
LELAKI: Bagi saya iya.

Hening. Suara angin melewati atap halte. Perempuan membuka map dan membaca lembaran pertama.

LELAKI: Kau masih menulis?
PEREMPUAN: (mengangkat kepala) Jadi kau ingat.
LELAKI: Aku ingat banyak hal. Terlalu banyak, mungkin.
PEREMPUAN: Dulu kau bilang menulis itu pekerjaan orang yang takut bicara.
LELAKI: Dan kau bilang, orang yang takut bicara justru paling jujur kalau menulis.
PEREMPUAN: Kita berdua benar.
LELAKI: Seperti biasa.

Perempuan tersenyum tipis. Ia menutup map.

PEREMPUAN: Aku menikah tahun depan.
LELAKI: Aku dengar.
PEREMPUAN: Dari siapa?
LELAKI: Dari kota ini. Kota kecil, kabarnya cepat sampai.
PEREMPUAN: Kau tidak datang ke pertunangan.
LELAKI: Aku tidak diundang.
PEREMPUAN: Aku mengirim undangan.
LELAKI: Aku tidak menerimanya.

Hening lagi. Lelaki menatap lampu jalan yang berkedip.

LELAKI: Kalau seandainya aku datang, apa yang akan kau lakukan?
PEREMPUAN: Tidak tahu. Mungkin memperkenalkanmu pada calon suamiku.
LELAKI: Sebagai apa?
PEREMPUAN: Sebagai orang yang pernah mengajari saya menunggu bus.
LELAKI: Itu pelajaran yang tidak berguna.
PEREMPUAN: Justru paling berguna.

Perempuan berdiri, merapikan mantelnya.

PEREMPUAN: Bus masih lewat jam empat pagi. Kalau kau memang menunggu, tunggu sampai subuh.
LELAKI: Kau mau ke mana?
PEREMPUAN: Pulang. Besok aku mengajar.
LELAKI: Kau jadi guru?
PEREMPUAN: Bahasa Indonesia.
LELAKI: (tertawa kecil) Pantas.
PEREMPUAN: Pantas apa?
LELAKI: Pantas kau masih menyimpan map itu.

Perempuan melangkah keluar halte, lalu berhenti.

PEREMPUAN: Kau tahu kenapa aku berhenti menulis?
LELAKI: Kenapa?
PEREMPUAN: Karena aku tidak pernah selesai menulis tentangmu.

Perempuan pergi. Lelaki duduk sendirian. Lampu jalan berkedip sekali lagi, lalu mati.

Tirai.`,
  },
  {
    id: "w-11",
    title: "Kota Kecil dan Hujan yang Sama",
    slug: "kota-kecil-dan-hujan-yang-sama",
    category: "cerpen",
    status: "published",
    publishedAt: "2026-03-14",
    excerpt:
      "Dua orang yang dulu berjanji akan pergi dari kota kecil ini bertemu lagi di halte yang sama, sepuluh tahun kemudian.",
    content: `Hujan turun tepat ketika bus yang ditunggu Nadia belum juga datang. Ia berteduh di halte tua dekat pasar, tempat dulu ia dan Bram menghabiskan banyak sore, membicarakan kota-kota yang ingin mereka tinggali.

Halte itu masih sama: catnya mengelupas, bangkunya miring ke kiri, dan jadwal bus yang ditempel sudah tidak terbaca lagi.

Nadia sudah sepuluh tahun tinggal di ibu kota. Ia punya pekerjaan yang dulu ia impikan, apartemen kecil, dan rutinitas yang membuat hari-harinya terasa cepat. Ia pulang ke kota ini hanya karena ibunya sakit.

"Masih suka hujan-hujanan?"

Nadia menoleh. Bram berdiri di ujung halte, memegang payung biru yang sudah pudar. Ia terlihat lebih tua, tetapi senyumnya masih sama.

"Tidak," jawab Nadia. "Sekarang aku lebih suka berteduh."

Bram duduk di bangku yang sama, menjaga jarak satu telapak tangan.

"Kerja di mana?" tanyanya.

"Jakarta. Kantor konsultan."

"Bagus."

"Kamu?"

"Di sini. Buka toko buku kecil dekat alun-alun."

Nadia menatapnya. "Kamu bilang dulu kamu ingin pergi dari kota ini."

Bram mengangkat bahu. "Aku pergi sebentar. Kuliah, kerja, lalu pulang."

"Kenapa?"

"Karena di kota besar, aku tidak pernah merasa hujan ini milikku."

Nadia tidak menjawab. Ia mendengar suara hujan di atap seng, suara yang sama seperti sepuluh tahun lalu.

"Kamu ingat janji kita?" tanya Bram.

"Kita akan pergi bersama, lalu kembali bersama."

"Kita tidak melakukannya bersama."

Nadia tersenyum pahit. "Kita melakukannya sendiri-sendiri."

Bus datang, memecah genangan di jalan. Lampunya menyorot wajah mereka bergantian.

Nadia berdiri. "Aku harus ke rumah sakit."

Bram mengangguk. "Semoga ibumu cepat sembuh."

Nadia melangkah ke pintu bus, lalu berhenti.

"Bram."

"Iya?"

"Toko bukunya punya buku puisi?"

Bram tersenyum. "Punya. Banyak."

"Simpan satu untukku. Aku akan datang minggu depan."

Bus berangkat. Nadia menatap ke luar jendela, dan untuk pertama kalinya setelah sepuluh tahun, ia merasa hujan di kota ini juga miliknya.`,
  },
  {
    id: "w-12",
    title: "Catatan dari Ruang Guru",
    slug: "catatan-dari-ruang-guru",
    category: "artikel",
    status: "published",
    publishedAt: "2026-02-06",
    excerpt:
      "Hal-hal yang tidak pernah masuk dalam kurikulum, tetapi paling sering diajarkan seorang guru di ruang guru.",
    content: `Ruang guru adalah tempat paling jujur di sekolah. Di sana, sebelum bel pertama berbunyi, para guru berbagi hal-hal yang tidak pernah tercantum dalam silabus.

Ada yang bercerita tentang murid yang datang tanpa sarapan. Ada yang menanyakan bagaimana menghadapi orang tua yang menuntut nilai tinggi tetapi tidak pernah menemani anaknya belajar. Ada pula yang hanya menuangkan kopi, lalu diam.

Kurikulum mengatur apa yang harus diajarkan. Ia tidak mengatur bagaimana menghadapi murid yang tiba-tiba menangis di tengah pelajaran, atau murid yang cerdas tetapi kehilangan semangat karena masalah di rumah.

Saya belajar bahwa mengajar adalah pekerjaan memperhatikan. Sebelum bisa menjelaskan majas, seorang guru harus tahu apakah muridnya sedang bisa mendengar. Sebelum menuntut tugas selesai, ia perlu tahu apakah muridnya punya tempat tenang untuk mengerjakannya.

Tentu, perhatian saja tidak cukup. Guru tetap perlu menguasai materi, menyiapkan pembelajaran yang baik, dan menilai dengan adil. Tetapi tanpa perhatian, semua itu hanya menjadi prosedur.

Ada satu kebiasaan kecil yang saya coba pertahankan: menanyakan kabar di awal pelajaran, satu menit saja. Jawabannya sering singkat—"baik, Bu"—tetapi kadang ada yang menjawab lebih lama, dan dari situ saya tahu siapa yang perlu ditemani sedikit lebih banyak hari itu.

Menjadi guru berarti menerima bahwa hasil kerja kita tidak selalu terlihat dalam rapor. Ada hal-hal yang baru berbuah bertahun-tahun kemudian: seorang murid yang akhirnya suka membaca, seorang murid yang berani bertanya, seorang murid yang tumbuh menjadi orang dewasa yang baik.

Catatan-catatan kecil dari ruang guru mungkin tidak akan pernah menjadi kebijakan pendidikan. Tetapi di situlah pekerjaan sesungguhnya berlangsung, jauh dari sorotan dan upacara.`,
  },
];

export const authorProfile: AuthorProfile = {
  name: "user123",
  initials: "U",
  role: "Guru Bahasa Indonesia · Penulis",
  location: "Yogyakarta, Indonesia",
  shortBio:
    "Guru Bahasa Indonesia yang menulis puisi, cerpen, dan esai tentang ingatan, rumah, dan hal-hal kecil yang sering terlewat.",
  bio: [
    "user123 mengajar Bahasa Indonesia di sebuah sekolah menengah di Yogyakarta. Ia percaya bahwa ruang kelas adalah tempat paling sunyi sekaligus paling ramai di dunia: sunyi karena setiap murid punya ceritanya sendiri, ramai karena semua cerita itu bertemu di satu ruangan.",
    "Menulis adalah cara ia mendengarkan. Puisi-puisinya lahir dari perjalanan pulang, dari percakapan di teras, dari hal-hal yang tidak sempat diucapkan. Cerpen dan esainya sering berbicara tentang pendidikan, kampung halaman, dan bahasa sebagai rumah pertama manusia.",
    "Selain mengajar dan menulis, ia mengelola taman baca kecil di dekat rumahnya—tempat anak-anak sekitar bisa meminjam buku tanpa kartu anggota, asalkan berjanji merawatnya.",
  ],
  quote:
    "Menulis bukan cara melarikan diri dari dunia, melainkan cara pulang ke dunia dengan mata yang lebih terbuka.",
  experience: [
    {
      period: "2012 — sekarang",
      title: "Guru Bahasa Indonesia",
      place: "Sekolah Menengah di Yogyakarta",
      description:
        "Mengajar bahasa dan sastra, mengelola program literasi sekolah, serta mendampingi kelompok penulisan murid.",
    },
    {
      period: "2017 — sekarang",
      title: "Pengelola Taman Baca",
      place: "Taman Baca Randu",
      description:
        "Merintis taman baca lingkungan dengan koleksi buku anak dan remaja yang dapat dipinjam secara gratis.",
    },
    {
      period: "2019 — 2024",
      title: "Kontributor Lepas",
      place: "Media daring dan jurnal pendidikan",
      description:
        "Menulis esai dan artikel tentang pembelajaran bahasa, literasi, dan budaya membaca.",
    },
    {
      period: "2021 — sekarang",
      title: "Fasilitator Lokakarya Menulis",
      place: "Komunitas guru dan pelajar",
      description:
        "Mendampingi guru dan pelajar dalam menulis pengalaman pribadi menjadi puisi dan cerpen.",
    },
  ],
  publications: [
    {
      year: "2026",
      title: "Jejak yang Tertinggal",
      note: "Kumpulan puisi (dalam proses)",
    },
    {
      year: "2025",
      title: "Rumah yang Tak Pernah Pergi",
      note: "Puisi, dimuat di antologi bersama",
    },
    {
      year: "2024",
      title: "Merawat Bahasa, Merawat Ingatan",
      note: "Esai pendidikan, dimuat di jurnal literasi",
    },
    {
      year: "2023",
      title: "Tunggu di Halte Terakhir",
      note: "Naskah drama, dipentaskan di panggung sekolah",
    },
  ],
};
