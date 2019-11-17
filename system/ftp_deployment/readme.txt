ftp_deployment - автообновление файлов на ftp

Как это работает:
deployment.ini - файл конфигурации
deployment - исполняемый файл, запуск процесса
ftp_deployment_enable.txt - текстовый файл с признаком "true" или "false". Если стоит "true" то deployment будет срабатывать, иначе - нет
Пример запуска: php deployment deployment.ini

Когда запускается:
Запускается автоматически на сервере после git push
Скрипт находится в project.git/hooks/post-update

Итог:
Обновление на ftp происходит автоматически при git push если в файле ftp_deployment_enable.txt стоит true