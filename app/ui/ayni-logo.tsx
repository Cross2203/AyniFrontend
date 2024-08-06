import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { lusitana } from '@/app/ui/fonts';

export default function AyniLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-orange`}>
      <FontAwesomeIcon icon={faHospitalUser} className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Ayni</p>
    </div>
  );
}
