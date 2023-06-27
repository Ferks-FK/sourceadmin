import { useState, useEffect } from "react";
import { PageContentBlock } from "@/components/elements/PageContentBlock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/elements/button";
import { Variant } from "@/components/elements/button/types";
import { Form } from "@/components/elements/Form";
import { Field } from "@/components/elements/Field";
import { Formik } from "formik";
import { getServerData } from "@/api/getServers";
import { useFlashMessages } from "@/hooks/useFlashMessages";
import { MuteEditSchema } from "@/yup/YupSchemas";
import { faClock, faCommentSlash, faHourglassHalf, faMicrophoneSlash, faNetworkWired, faPlay, faQuestion, faServer, faUser, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { faSteam } from "@fortawesome/free-brands-svg-icons"
import { router } from '@inertiajs/react';
import { Modal } from "@/components/elements/modal";
import { useTranslation } from "react-i18next";

function MuteShow({ mute, reasons, timeBans, flash, errors }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [serverInfo, setServerInfo] = useState([]);
  const [reasonsData] = useState(reasons);
  const [timeBansData] = useState(timeBans);
  const [muteInfo] = useState(mute);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await getServerData(muteInfo.server_id, false);

        setServerInfo(response[0])
      } catch (error) {
        console.error(error)
      }
    }

    if (muteInfo.server_id) {
      fetchServerData()
    }
  }, [])

  const handleSubmit = (values) => {
    router.patch(route('admin.mutes.update', muteInfo.id), { ...values })
  }

  const handleDelete = () => {
    router.delete(route('admin.mutes.destroy', muteInfo.id))
  }

  const handleUnmute = () => {
    router.put(route('admin.mutes.action.unmute', muteInfo.id))
  }

  const handleRemute = () => {
    router.put(route('admin.mutes.action.remute', muteInfo.id))
  }

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  }

  const hideModal = () => {
    setModalVisible(false);
    setModalContent('');
  }

  useFlashMessages(flash, errors)

  return (
    <PageContentBlock title={t('mutes_settings.mute_of', {playerName: muteInfo.player_name})}>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 p-4 bg-dark-primary">
        <ul>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faUser} color="white" className="w-4" />&nbsp;
            <p>{t('report.player_name')}: {muteInfo.player_name}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faNetworkWired} color="white" className="w-4" />&nbsp;
            <p>{t('report.player_ip')}: {muteInfo.ip ?? t('generic.no_ip')}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faSteam} color="white" className="w-4" />&nbsp;
            <p>{t('report.steam_id')}: {muteInfo.steam_id ?? t('generic.no_steam')}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faPlay} color="white" className="w-4" />&nbsp;
            <p>{t('generic.created_at')}: {muteInfo.created_at}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faHourglassHalf} color="white" className="w-4" />&nbsp;
            <p>{t('generic.length')}: {muteInfo.time_ban_name}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faClock} color="white" className="w-4" />&nbsp;
            <p>{t('generic.expires_at')}: {muteInfo.time_ban_value == 0 ? t('generic.never') : muteInfo.end_at}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faQuestion} color="white" className="w-4" />&nbsp;
            <p>{t('appeal.reason')}: {muteInfo.reason}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faUserGear} color="white" className="w-4" />&nbsp;
            <p>{t('mutes_settings.muted_by')}: {muteInfo.admin_name ?? t('generic.admin_deleted')}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={muteInfo.type === 'voice' ? faMicrophoneSlash : faCommentSlash} color="white" className="w-4" />&nbsp;
            <p>{t('mutes_settings.total_mutes')}: {muteInfo.ban_count}</p>
          </li>
          <li className="flex mobile:items-center">
            <FontAwesomeIcon icon={faServer} color="white" className="w-4" />&nbsp;
            <p>{t('mutes_settings.muted_from')}: {muteInfo.server_id ? serverInfo.HostName : t('generic.server_deleted')}</p>
          </li>
        </ul>
        <div className="flex justify-center gap-2">
          {muteInfo.player_is_muted ?
            <Button.Text variant={Variant.Warning} onClick={() => showModal(
              <>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl text-left">{t('mutes_settings.unmute_player', {playerName: muteInfo.player_name})}?</h3>
                  <p className="text-sm">
                    {t('mutes_settings.unmute_player_message')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button.Text onClick={hideModal}>
                    {t('cancel', {ns: 'buttons'})}
                  </Button.Text>
                  <Button.Danger onClick={handleUnmute}>
                    {t('unmute', {ns: 'buttons'})}
                  </Button.Danger>
                </div>
              </>
            )}>
              {t('unmute', {ns: 'buttons'})}
            </Button.Text>
            :
            <Button.Text variant={Variant.Info} onClick={() => showModal(
              <>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl text-left">{t('mutes_settings.remute_player', {playerName: muteInfo.player_name})}?</h3>
                  <p className="text-sm">
                    {t('mutes_settings.remute_player_message')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button.Text onClick={hideModal}>
                    {t('cancel', {ns: 'buttons'})}
                  </Button.Text>
                  <Button.Danger onClick={handleRemute}>
                    {t('remute', {ns: 'buttons'})}
                  </Button.Danger>
                </div>
              </>
            )}>
              {t('remute', {ns: 'buttons'})}
            </Button.Text>
          }
          <Button.Danger className={'!font-header'} onClick={() => showModal(
            <>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl text-left">{t('mutes_settings.delete_mute_of', {playerName: muteInfo.player_name})}?</h3>
                <p className="text-sm">
                  {t('mutes_settings.delete_mute_of_message')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button.Text onClick={hideModal}>
                  {t('cancel', {ns: 'buttons'})}
                </Button.Text>
                <Button.Danger onClick={handleDelete}>
                  {t('delete', {ns: 'buttons'})}
                </Button.Danger>
              </div>
            </>
          )}>
            {t('delete_mute', {ns: 'buttons'})}
          </Button.Danger>
        </div>
      </div>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          reason_id: muteInfo.reason_id,
          time_ban_id: muteInfo.time_ban_id
        }}
        validationSchema={MuteEditSchema}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <div className="flex flex-col gap-4 p-4 bg-dark-primary">
            <Modal
              isVisible={modalVisible}
              onClickCloseBtn={hideModal}
              onPressEscKey={hideModal}
              onClickBackdrop={hideModal}
            >
              <div className="flex flex-col justify-between h-full items-center gap-2 p-2">
                {modalContent}
              </div>
            </Modal>
            <Form
              formikClassNames={'flex justify-center w-full'}
              formSize={'full'}
              className={'max-w-6xl w-full'}
            >
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  <Field
                    type={'select'}
                    name={'time_ban_id'}
                    id={'time_ban_id'}
                    label={t('generic.length')}
                    value={values.time_ban_id}
                    onChange={(e) => setFieldValue('time_ban_id', e.target.value)}
                  >
                    {timeBansData.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Field>
                  <Field
                    type={'select'}
                    name={'reason_id'}
                    id={'reason_id'}
                    label={t('appeal.reason')}
                    value={values.reason_id}
                    onChange={(e) => setFieldValue('reason_id', e.target.value)}
                  >
                    {reasonsData.map(({ id, reason }) => (
                      <option key={id} value={id}>
                        {reason}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="flex flex-col items-center">
                  <Button.Text type={'submit'} disabled={isSubmitting}>
                    {t('submit', {ns: 'buttons'})}
                  </Button.Text>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </PageContentBlock>
  )
}

export default MuteShow
