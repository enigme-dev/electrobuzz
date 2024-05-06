import { Button } from "@/core/components/ui/button";
import React from "react";

interface RegisterAsMerchantTermsAndConditionsProps {
  onPrevious: Function;
  onNext: Function;
}

const RegisterAsMerchantTermsAndConditions = ({
  onPrevious,
  onNext,
}: RegisterAsMerchantTermsAndConditionsProps) => {
  return (
    <div className="pt-10 sm:pt-0">
      <h1 className="font-bold text-xl">Syarat dan Ketentuan</h1>
      <div className="pt-5 grid gap-3 place-content-start">
        <h2 className="font-semibold">1. Identifikasi Resmi</h2>
        <p className="text-sm">
          - Mitra diharuskan untuk mengunggah salinan identifikasi resmi yang
          sah, seperti kartu identitas, untuk tujuan verifikasi identitas.
          Dokumen ini harus memiliki foto dan nama lengkap yang sesuai dengan
          informasi yang disediakan pada formulir pendaftaran.
        </p>
        <h2 className="font-semibold">
          2. Sertifikasi atau Lisensi Profesional:
        </h2>
        <p className="text-sm">
          - mitra harus menyertakan salinan dokumen sertifikasi atau lisensi
          profesional.
        </p>
        <h2 className="font-semibold">3. Dokumen Pendukung Lainnya:</h2>
        <p className="text-sm">
          Mitra mungkin diminta untuk menyertakan dokumen pendukung tambahan
          sesuai kebutuhan atau persyaratan khusus. Contoh dokumen ini termasuk:
          <p className="text-sm">
            - Surat referensi dari klien atau perusahaan sebelumnya yang
            menunjukkan pengalaman dan kualitas layanan.
          </p>
          <p className="text-sm">
            - Portofolio pekerjaan yang menampilkan proyek-proyek terdahulu atau
            pencapaian profesional lainnya.
          </p>
          <p className="text-sm">
            - Dokumen pendukung lainnya yang dapat membantu memvalidasi
            kualifikasi, pengalaman, atau keahlian khusus yang dimiliki oleh
            mitra.
          </p>
          <p className="text-sm">
            - Dokumen SKCK(Surat Keterangan Berkelakuan Baik) untuk memastikan
            bahwa mitra tidak pernah melakukan tindakan kriminal, hal ini
            dibutuhkan demi keamanan user.
          </p>
        </p>
        <p className="font-semibold">
          Selain itu, terdapat juga syarat dan ketentuan terkait tindakan
          kriminal dan kerjasama dengan otoritas hukum, seperti:
        </p>
        <h2 className="font-semibold">4. Pemutusan Hubungan Kerja:</h2>
        <p className="text-sm">
          - Teknisi yang terlibat dalam tindakan kriminal selama bekerja untuk
          Electrobuzz akan dikenakan sanksi tegas, termasuk pemutusan hubungan
          kerja dan tindakan hukum yang sesuai.
        </p>
        <h2 className="font-semibold">5. Kewajiban Melaporkan:</h2>
        <p className="text-sm">
          - Setiap teknisi wajib melaporkan kepada Electrobuzz jika terkena
          tuduhan atau dinyatakan bersalah atas tindakan kriminal selama masa
          bekerja atau sebagai bagian dari jaringan teknisi.
        </p>
        <h2 className="font-semibold">6. Kerjasama dengan Otoritas Hukum:</h2>
        <p className="text-sm">
          - Electrobuzz akan berkomitmen untuk bekerja sama sepenuhnya dengan
          otoritas hukum untuk menyelidiki dan menindaklanjuti tindakan kriminal
          yang melibatkan teknisi yang terdaftar.
        </p>
        <p className="font-semibold">
          Dengan menerapkan syarat dan ketentuan ini, Electrobuzz dapat
          memastikan bahwa mitra yang terdaftar memenuhi standar keamanan,
          kualifikasi, dan etika kerja yang ditetapkan, sehingga dapat
          memberikan layanan yang berkualitas dan aman bagi pelanggan.
        </p>
        <div className="flex gap-4">
          <input type="checkbox" name="" id="" /> Saya setuju dengan Syarat dan
          Ketentuan diatas
        </div>
      </div>
      <div className="flex justify-between pt-5">
        <Button
          variant={"default"}
          className="bg-yellow-400 hover:bg-yellow-300 text-black dark:text-white"
          onClick={() => onPrevious()}
        >
          Kembali
        </Button>
        <Button
          variant={"default"}
          className="bg-yellow-400 hover:bg-yellow-300 text-black dark:text-white"
          onClick={() => onNext()}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
};

export default RegisterAsMerchantTermsAndConditions;
